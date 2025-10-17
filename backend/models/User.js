
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    profilePic: { type: String },
    dob: { type: Date },
    gender: { type: String, enum: ["male", "female", "other"] },

    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String, default: "Nepal" },
      altPhone: { type: String },
    },

    role: { type: String, enum: ["user", "admin"], default: "user" },

    // 🔥 Link each user to their cart
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
  },
  { timestamps: true }
);

// Remove cart reference when user is deleted
userSchema.pre('remove', async function(next) {
  try {
    await mongoose.model('Cart').deleteOne({ user: this._id });
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("User", userSchema);
