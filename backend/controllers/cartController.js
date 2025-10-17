
const Cart = require("../models/cart");
const Product = require("../models/Product");

// 🔹 Get logged-in user's cart
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product", "name price image");
    
    if (!cart) {
      cart = new Cart({ 
        user: req.user._id, 
        items: [],
        total: 0
      });
      await cart.save();
    }
    
    res.json(cart);
  } catch (err) {
    console.error("❌ getCart error:", err);
    res.status(500).json({ message: "Error fetching cart" });
  }
};

// 🔹 Add product to user's cart
const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    if (product.stock < quantity) {
      return res.status(400).json({ 
        message: `Only ${product.stock} items available in stock` 
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ 
        user: req.user._id, 
        items: [] 
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Update quantity if product already exists
      const newQuantity = cart.items[itemIndex].quantity + quantity;
      
      if (product.stock < newQuantity) {
        return res.status(400).json({ 
          message: `Only ${product.stock} items available in stock` 
        });
      }
      
      cart.items[itemIndex].quantity = newQuantity;
    } else {
      // Add new product to cart
      cart.items.push({ 
        product: productId, 
        quantity,
        price: product.price
      });
    }

    await cart.save();
    await cart.populate("items.product", "name price image");

    res.json(cart);
  } catch (err) {
    console.error("❌ addToCart error:", err);
    res.status(500).json({ message: "Error adding to cart" });
  }
};

// 🔹 Update cart item quantity
const updateCartItem = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  try {
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    if (product.stock < quantity) {
      return res.status(400).json({ 
        message: `Only ${product.stock} items available in stock` 
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    await cart.populate("items.product", "name price image");

    res.json(cart);
  } catch (err) {
    console.error("❌ updateCartItem error:", err);
    res.status(500).json({ message: "Error updating cart item" });
  }
};

// 🔹 Remove one product from cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    if (initialLength === cart.items.length) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    await cart.save();
    await cart.populate("items.product", "name price image");

    res.json(cart);
  } catch (err) {
    console.error("❌ removeFromCart error:", err);
    res.status(500).json({ message: "Error removing from cart" });
  }
};

// 🔹 Clear user's cart
const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    cart.total = 0;
    await cart.save();

    res.json({ message: "Cart cleared", cart });
  } catch (err) {
    console.error("❌ clearCart error:", err);
    res.status(500).json({ message: "Error clearing cart" });
  }
};

module.exports = { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart 
};
