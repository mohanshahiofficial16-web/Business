
// routes/cart.js
const express = require("express");
const router = express.Router();
const { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart 
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

// Get user cart
router.get("/", protect, getCart);

// Add item to cart
router.post("/", protect, addToCart);

// Update cart item quantity
router.put("/item/:productId", protect, updateCartItem);

// Remove item from cart
router.delete("/item/:productId", protect, removeFromCart);

// Clear entire cart
router.delete("/clear", protect, clearCart);

module.exports = router;
