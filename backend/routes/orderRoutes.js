const express = require("express");
const router = express.Router();
const { createOrder, getOrders, updateOrderStatus } = require("../controllers/orderController");
const { protect, admin } = require("../middleware/authMiddleware");

router.post("/", protect, createOrder);
router.get("/", protect, admin, getOrders);
router.put("/:id", protect, admin, updateOrderStatus);

module.exports = router;
