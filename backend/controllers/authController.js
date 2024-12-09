const bcrypt = require("bcrypt");
const User = require("../models/User");
const multer = require("multer");

const mongoose = require('mongoose');

// Admin hardcoded credentials
const adminCredentials = { username: "admin", password: "admin123" };

// Multer setup for video upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });




// Middleware to handle file upload
exports.uploadVideo = upload.single("video");


// Admin creates a supermanager
exports.createSuperManager = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, password: hashedPassword, role: "supermanager" });
      await newUser.save();
      res.status(201).json({ message: "SuperManager created successfully", user: newUser });
    } catch (error) {
      console.error("Error creating supermanager:", error);
      res.status(500).json({ error: "Server error during supermanager creation" });
    }
  };
  
  exports.createManager = async (req, res) => {
    const { username, password, parentId } = req.body;
  
    try {
      // Validate parentId
      const validParentId = parentId && mongoose.Types.ObjectId.isValid(parentId) ? parentId : null;
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        password: hashedPassword,
        role: "manager",
        parentId: validParentId, // Use the validated or null parentId
        videoUrl: req.file?.path || null,
      });
      await newUser.save();
  
      res.status(201).json({ message: "Manager created successfully", user: newUser });
    } catch (error) {
      console.error("Error creating manager:", error);
      res.status(500).json({ error: "Server error during manager creation" });
    }
  };
// Admin login
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (username === adminCredentials.username && password === adminCredentials.password) {
      return res.status(200).json({ role: "admin", username });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    res.status(200).json({ role: user.role, username: user.username, id: user._id });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Server error during login" });
  }
};

// Register users (Supermanagers or Managers)
exports.registerUser = async (req, res) => {
  const { username, password, role, parentId } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role, parentId, videoUrl: req.file?.path || null });
    await newUser.save();

    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Server error during user registration" });
  }
};

// Get managers under a supermanager
exports.getManagers = async (req, res) => {
  const { parentId } = req.params;

  try {
    const managers = await User.find({ parentId, role: "manager" }).select("username videoUrl");
    res.status(200).json(managers);
  } catch (error) {
    console.error("Error fetching managers:", error);
    res.status(500).json({ error: "Server error" });
  }
};
exports.getManagerVideos = async (req, res) => {
    const { parentId } = req.params;
  
    try {
      // Validate and cast parentId
      if (!parentId || !mongoose.Types.ObjectId.isValid(parentId)) {
        return res.status(400).json({ error: "Invalid or missing parentId" });
      }
  
      const managers = await User.find({ parentId, role: "manager" }).select("username videoUrl");
      res.status(200).json(managers);
    } catch (error) {
      console.error("Error fetching manager videos:", error);
      res.status(500).json({ error: "Server error during fetching manager videos" });
    }
  };
  exports.getOwnVideo = async (req, res) => {
    const { managerId } = req.params;
  
    try {
      // Validate and find the manager
      if (!managerId || !mongoose.Types.ObjectId.isValid(managerId)) {
        return res.status(400).json({ error: "Invalid manager ID" });
      }
  
      const manager = await User.findById(managerId).select("username videoUrl");
      if (!manager) return res.status(404).json({ error: "Manager not found" });
  
      // Send videoUrl and username
      res.status(200).json(manager);
    } catch (error) {
      console.error("Error fetching manager video:", error);
      res.status(500).json({ error: "Server error" });
    }
  };
  