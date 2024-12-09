const express = require("express");
const { loginUser, registerUser, getManagers, uploadVideo, getManagerVideos, getOwnVideo,createSuperManager,createManager } = require("../controllers/authController");

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", uploadVideo, registerUser);
router.get("/managers/:parentId", getManagers);
router.get("/videos/managers/:parentId", getManagerVideos); // For supermanager to get videos of all their managers
router.get("/video/manager/:managerId", getOwnVideo); // For a single manager to get their own video
router.post("/create-supermanager", createSuperManager); // Admin creates supermanager
router.post("/create-manager", uploadVideo, createManager); // Supermanager creates manager




module.exports = router;
