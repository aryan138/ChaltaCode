const Branch = require('../models/branch');
const InventoryBranch = require('../models/inventoryBranch');
const Inventory = require('../models/inventory');
const mongoose = require('mongoose');

// Create new branch
exports.createBranch = async (req, res) => {
  try {
    const { branch_name, branch_type, branch_email, branch_phno } = req.body;

    // Validate input
    if (!branch_name || !branch_type || !branch_email || !branch_phno) {
      return res.status(400).json({
        message: "failed",
        error: "Please fill all required fields"
      });
    }

    // Create a new branch
    const newBranch = new Branch({
      branch_name,
      branch_type,
      branch_email,
      branch_phno
    });

    // Save the branch to the database
    await newBranch.save();

    // Return the newly created branch
    res.status(201).json({
      message: 'Branch created successfully',
      branch: newBranch
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      message: 'Failed to create branch',
      error: error.message
    });
  }
};


// Get all branches
exports.getBranches = async (req, res) => {
  try {
    // Retrieve all branches from the database
    const branches = await Branch.find();
    console.log(branches);

    // Check if no branches are found
    if (!branches.length) {
      return res.status(404).json({
        message: 'No branches found'
      });
    }

    // Return the list of branches
    res.status(200).json({
      message: 'Branches retrieved successfully',
      branches
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      message: 'Failed to retrieve branches',
      error: error.message
    });
  }
};


// Get a branch by ID
exports.getBranchById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid branch ID' });
    }

    // Find the branch by ID
    const branch = await Branch.findById(id);

    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    res.status(200).json({
      message: 'Branch retrieved successfully',
      branch
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve branch',
      error: error.message
    });
  }
};


// Update a branch by ID
exports.updateBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const { branch_name, branch_type, branch_email, branch_phno } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid branch ID' });
    }

    // Check for empty update fields
    const updateData = {};
    if (branch_name) updateData.branch_name = branch_name;
    if (branch_type) updateData.branch_type = branch_type;
    if (branch_email) updateData.branch_email = branch_email;
    if (branch_phno) updateData.branch_phno = branch_phno;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    // Update the branch
    const updatedBranch = await Branch.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedBranch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    res.status(200).json({
      message: 'Branch updated successfully',
      branch: updatedBranch
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update branch',
      error: error.message
    });
  }
};


// Shift specific or group of inventory items to another inventory branch's same inventoryBranch
exports.shiftInventoryItems = async (req, res) => {
  try {
    const { id } = req.params; 
    const { item_ids, target_inventoryBranch_id } = req.body;

    // Validate input
    if (!target_inventoryBranch_id) {
      return res.status(400).json({ message: 'Target inventory branch ID is required' });
    }

    // Find the current branch
    const currentBranch = await Branch.findById(id);
    if (!currentBranch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    // Find the target inventory branch
    const targetInventoryBranch = await InventoryBranch.findById(target_inventoryBranch_id);
    if (!targetInventoryBranch) {
      return res.status(404).json({ message: 'Target inventory branch not found' });
    }

    // Validate item_ids if provided
    if (item_ids && !Array.isArray(item_ids)) {
      return res.status(400).json({ message: 'item_ids should be an array' });
    }

    // Shift specific items if item_ids are provided
    if (item_ids && item_ids.length > 0) {
      // Validate item_ids format
      if (!item_ids.every(id => mongoose.Types.ObjectId.isValid(id))) {
        return res.status(400).json({ message: 'Invalid item ID format' });
      }

      // Update only the items with the provided item_ids
      await Inventory.updateMany(
        { _id: { $in: item_ids }, inventoryBranch: currentBranch._id },
        { inventoryBranch: targetInventoryBranch._id }
      );
    } else {
      // If no item_ids provided, shift all items from the current inventory branch to the target inventory branch
      await Inventory.updateMany(
        { inventoryBranch: currentBranch._id },
        { inventoryBranch: targetInventoryBranch._id }
      );
    }

    res.status(200).json({ message: 'Inventory items shifted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to shift inventory items', error: error.message });
  }
};


// Delete a branch and its associated inventory branch and its inventory items
exports.deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the branch
    const branch = await Branch.findByIdAndDelete(id);
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    // Find all inventory branches associated with the deleted branch
    const inventoryBranches = await InventoryBranch.find({ branch_id: branch._id });

    // Delete all inventory branches and their associated inventory items
    for (const inventoryBranch of inventoryBranches) {
      await Inventory.deleteMany({ inventoryBranch: inventoryBranch._id });
    }

    // Bulk delete inventory branches
    await InventoryBranch.deleteMany({ branch_id: branch._id });

    res.status(200).json({ message: 'Branch and associated inventory deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete branch and associated inventory', error: error.message });
  }
};
