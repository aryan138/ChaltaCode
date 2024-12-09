const Product = require("../models/Product");

// Create Product (Manual Entry)
const createProduct = async (req, res) => {
  const { product_id, name, price, stock } = req.body;
  const userId = req.user._id;
  if (!userId) {
    return res.status(400).json({ message: "User ID is missing." });
  }
  try {
    const newProduct = new Product({
      product_id,
      name,
      price,
      stock,
      user: userId,
    });

    await newProduct.save();

    res.status(200).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    if (error.code === 11000) {
      res.status(400).json({
        message: `Product ID '${product_id}' already exists for this user.`,
      });
    } else {
      res.status(500).json({
        message: "Error creating product",
        error: error.message,
      });
    }
  }
};


// Read Products (Fetch All)
const getAllProducts = async (req, res) => {
  const userId = req.user._id;

  try {
    const products = await Product.find({ user: userId });
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};


// Update Product
const updateProduct = async (req, res) => {
  const { name, price, stock } = req.body;
  const { product_id } = req.params;
  const userId = req.user._id;

  if (!name || !price || !stock) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Find the product by product_id and update it with the new values
    const product = await Product.findOneAndUpdate(
      { product_id, user: userId }, // Use product_id from the URL parameter
      { name, price, stock },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  const { product_id } = req.params;
  const userId = req.user._id;
  try {
    const product = await Product.findOneAndDelete({ product_id, user: userId });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};

// Handle JSON Data Submission (not Excel)
const uploadExcel = async (req, res) => {
  const data = req.body; // Assuming JSON data is submitted via API
  const userId = req.user._id;

  if (!Array.isArray(data) || data.length === 0) {
    return res.status(400).json({ message: "No valid data submitted" });
  }

  // Validate each row
  const errors = [];
  const validData = data.filter((row, index) => {
    const isValid =
      row.product_id &&
      typeof row.product_id === "string" &&
      row.name &&
      typeof row.name === "string" &&
      row.price > 0 &&
      typeof row.price === "number" &&
      row.stock >= 0 &&
      typeof row.stock === "number";

    if (!isValid) {
      errors.push({
        row: index + 1,
        message: "Invalid fields or missing required values.",
      });
    } else {
      row.user = userId; // Assign authenticated user ID to each product
    }

    return isValid;
  });

  if (validData.length === 0) {
    return res.status(400).json({
      message: "No valid rows to upload. Please check your data.",
      errors,
    });
  }

  try {
    // Check for duplicate product_id under the same user
    const existingProducts = await Product.find({
      product_id: { $in: validData.map((row) => row.product_id) },
      user: userId,
    }).select("product_id");

    const duplicates = validData.filter((row) =>
      existingProducts.some(
        (existing) => existing.product_id === row.product_id
      )
    );

    if (duplicates.length > 0) {
      return res.status(400).json({
        message: "Some rows failed due to duplicate Product IDs for this user.",
        duplicateErrors: duplicates.map((dup) => ({
          product_id: dup.product_id,
          message: "Duplicate Product ID for this user.",
        })),
        otherErrors: errors.length > 0 ? errors : undefined,
      });
    }

    // Insert validated data
    const products = await Product.insertMany(validData, { ordered: false });

    res.status(200).json({
      message: "Products added successfully",
      products,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Error during Excel upload:", error);

    if (error.code === 11000) {
      const duplicateErrorRows = validData
        .map((row, index) => {
          if (error.message.includes(row.product_id)) {
            return {
              row: index + 1,
              product_id: row.product_id,
              message: "Duplicate Product ID",
            };
          }
          return null;
        })
        .filter(Boolean);

      return res.status(400).json({
        message: "Some rows failed due to duplicate Product IDs.",
        duplicateErrors: duplicateErrorRows,
        otherErrors: errors.length > 0 ? errors : undefined,
      });
    }

    res.status(500).json({
      message: "Error uploading products",
      error: error.message,
      errors,
    });
  }
};


module.exports = {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  uploadExcel,
};
