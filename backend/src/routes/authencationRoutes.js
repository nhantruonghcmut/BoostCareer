const express = require("express");
const router = express.Router();
const {
  login,
  register,
  logout,
  refreshToken,
  checkLoginStatus
} = require("../controllers/authencationControllers.js");
const { verifyToken } = require("../middlewares/authMiddleware");

// Public routes
router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.post("/refresh", refreshToken);
router.get("/check-login", checkLoginStatus);

module.exports = router;
