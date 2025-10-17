// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

const { createProduct, getProducts } = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");

// ✅ GET all products (from controller)
router.get("/", getProducts);

// GET single product by id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found in database" });
    }

    res.json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(400).json({ message: "Invalid product ID" });
  }
});


// ✅ POST new product (protected & admin only)
router.post("/", protect, admin, createProduct);

module.exports = router;
