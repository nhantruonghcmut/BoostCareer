const express = require("express");
const router = express.Router();
const {
  login,
  register,
  logout,
  refreshToken,
  } = require("../controllers/authencationControllers.js");
const { verifyToken } = require("../middlewares/authMiddleware");

// Public routes
router.post("/login", login);
router.post("/register", register);
router.delete("/logout", logout);
router.post("/refresh", refreshToken);


module.exports = router;
