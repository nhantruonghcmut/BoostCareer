const express = require("express");

const {
  isLogin,
  login,
  logout,
  register,
} = require("../controllers/authencationControllers.js");

const authencationRoutes = express.Router();

authencationRoutes.get("/check", isLogin); //kiểm tra đã đăng nhập chưa
authencationRoutes.post("/login", login); //Đăng nhập
authencationRoutes.delete("/logout", logout); //Đăng xuất
authencationRoutes.post("/register", register);

module.exports = authencationRoutes;
