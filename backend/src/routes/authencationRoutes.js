import express from "express";

import {
  login,
  register,
  logout,
  refreshToken,
  } from "../controllers/authencationControllers.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { authLimiter } from "../config/security.js";
const router = express.Router();
// Public routes
router.post("/login", authLimiter, login);
router.post("/register", authLimiter, register);
router.delete("/logout", logout);
router.post("/refresh", authLimiter, refreshToken);


export default router;
