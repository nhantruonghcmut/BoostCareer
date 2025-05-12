const express = require("express");

const {
  isLogin,
  login,
  logout,
  getCurrentUser
} = require("../controllers/Control_authencations.js");

const Routes_authencation = express.Router();

Routes_authencation.get("/", isLogin); // Check login status
Routes_authencation.get("/me", getCurrentUser); // Get current user info
Routes_authencation.post("/login", login); // Login
Routes_authencation.post("/logout", logout); // Logout


module.exports = Routes_authencation;
