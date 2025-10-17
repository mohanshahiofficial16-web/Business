
// models/Cart.js
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true, 
    unique: true 
  },
  items: [
    {
      product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Product", 
        required: true 
      },
      quantity: { 
        type: Number, 
        default: 1,
        min: 1
      },
      price: {
        type: Number,
        required: true
      }
    },
  ],
  total: {
    type: Number,
    default: 0
  }
});

// Calculate total before saving
cartSchema.pre('save', function(next) {
  this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  next();
});

module.exports = mongoose.model("Cart", cartSchema);
