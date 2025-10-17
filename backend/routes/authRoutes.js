const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const { registerUser, loginUser } = require("../controllers/authController");
const auth = require("../middleware/auth");
const User = require("../models/User");

// Upload folder
const uploadPath = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Routes
router.post("/register", upload.single("profilePic"), registerUser);
router.post("/login", loginUser);
router.put("/profile", auth, upload.single("profilePic"), async (req, res) => {
  try {
    const updates = req.body;
    if (req.file) updates.profilePic = req.file.path;
    const user = await User.findByIdAndUpdate(req.userId, updates, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating profile" });
  }
});

module.exports = router;
