
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Cart = require("../models/cart");

// Register
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password)
      return res.status(400).json({ message: "Please fill all required fields" });

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const profilePic = req.file ? req.file.path : "";

    // 1️⃣ Create user
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      profilePic,
    });

    // 2️⃣ Create an empty cart for the new user
    const cart = new Cart({ 
      user: newUser._id, 
      items: [],
      total: 0
    });
    await cart.save();

    // 3️⃣ Link cart to user
    newUser.cart = cart._id;
    await newUser.save();

    // Populate cart reference for response
    await newUser.populate('cart');

    res.status(201).json({ message: "User registered", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Provide email and password" });

    const user = await User.findOne({ email }).populate("cart");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "secretkey", {
      expiresIn: "7d",
    });

    res.status(200).json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser };
