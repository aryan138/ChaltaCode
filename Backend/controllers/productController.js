const Product = require('../models/Product');
const multer = require('multer');
const XLSX = require('xlsx');

// Set up multer for file upload (This can be removed if you no longer need Excel file uploads)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create Product (Manual Entry)
const createProduct = async (req, res) => {
  const { product_id, name, price, stock } = req.body;
  try {
    const newProduct = new Product({ product_id, name, price, stock });
    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error });
  }
};

// Read Products (Fetch All)
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  const { product_id, name, price, stock } = req.body;
  try {
    const product = await Product.findOneAndUpdate({ product_id }, { name, price, stock }, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  const { product_id } = req.params;
  try {
    const product = await Product.findOneAndDelete({ product_id });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};

// Handle JSON Data Submission (not Excel)
const uploadExcel = async (req, res) => {
  const data = req.body;

  // Validate the data structure
  if (!Array.isArray(data) || data.length === 0) {
    return res.status(400).json({ message: 'No valid data submitted' });
  }

  // Optional: Validate that each row contains the necessary fields
  const isValid = data.every(row => row.product_id && row.name && row.price > 0 && row.stock >= 0);
  if (!isValid) {
    return res.status(400).json({ message: 'Some rows are missing required fields or have invalid values.' });
  }

  try {
    // Insert the validated data into the database
    const products = await Product.insertMany(data);
    res.status(200).json({ message: 'Products added successfully', products });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading products', error });
  }
};



module.exports = {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  uploadExcel,
  upload,
};
