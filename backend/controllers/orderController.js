const Order = require("../models/Order");

// ✅ Create Order
const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress } = req.body;
    const newOrder = new Order({
      user: req.user.id,
      products: items, // map frontend `items` to backend `products`
      totalAmount,
      shippingAddress
    });
    await newOrder.save();
    res.status(201).json({ message: "Order created", order: newOrder });
  } catch (err) {
    console.error("❌ createOrder error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ Get all orders (admin)
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");
    res.json(orders);
  } catch (err) {
    console.error("❌ getOrders error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    order.status = req.body.status;
    await order.save();
    res.json({ message: "Order status updated", order });
  } catch (err) {
    console.error("❌ updateOrderStatus error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createOrder, getOrders, updateOrderStatus };
