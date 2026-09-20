const express = require("express");

const {
  register,
  login,
  getMe,
  updateProfile,
  getProfileStats
} = require("../controllers/auth.controller");

const protect = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.get("/stats", protect, getProfileStats);

module.exports = router;