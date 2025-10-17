// controllers/productController.js
const Product = require("../models/Product");

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products" });
  }
};
  
// Create product
const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json({ message: "Product added successfully", product });
  } catch (err) {
    res.status(500).json({ message: "Error adding product" });
  }
};

module.exports = { getProducts, createProduct };
