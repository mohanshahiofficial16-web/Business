const User = require("../models/User");
const Order = require("../models/Order");

// ✅ Analytics
const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const orders = await Order.find();
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

    res.json({ totalUsers, totalOrders, totalRevenue });
  } catch (error) {
    console.error("❌ getAnalytics error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAnalytics };
