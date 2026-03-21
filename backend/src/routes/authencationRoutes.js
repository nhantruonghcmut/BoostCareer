import express from "express";

import {
  login,
  register,
  logout,
  refreshToken,
  } from "../controllers/authencationControllers.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
const router = express.Router();
// Public routes
router.post("/login", login);
router.post("/register", register);
router.delete("/logout", logout);
router.post("/refresh", refreshToken);


export default router;
