const bcrypt = require("bcrypt");
const {
  findUserByUsername,
  loginExecute,register_user
} = require("../models/Model_authencation.js");

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Tài khoản và mật khẩu không được để trống." });
  }

  try {
    // Find user in database
    const user = await findUserByUsername(username);

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Tài khoản hoặc mật khẩu không đúng." });
    }

    const userLogin = await loginExecute(username, password);

    if (!userLogin) {
      return res
        .status(401)
        .json({ success: false, message: "Tài khoản hoặc mật khẩu không đúng." });
    }

    // Check if user is admin
    if (userLogin.role_id !== 1) {
      return res
        .status(403)
        .json({ success: false, message: "Tài khoản không có quyền truy cập vào hệ thống quản trị." });
    }

    // Generate token (JWT can be used here)
    const token = Date.now().toString(); // This should be replaced with a proper JWT token

    // Store user info in session
    req.session.userLogin = {
      id: userLogin.user_id,
      username: userLogin.username,
      role: userLogin.role_id,
      create_date: userLogin.create_date,
      token
    };

    res.status(200).json({ 
      success: true, 
      message: "Đăng nhập thành công.", 
      user: {
        id: userLogin.user_id,
        username: userLogin.username,
        role: userLogin.role_id,
        create_date: userLogin.create_date
      },
      token
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Có lỗi khi đăng nhập." });
  }
};

const isLogin = (req, res) => {
  if (req.session.userLogin) {
    return res
      .status(200)
      .json({ loggedIn: true, user: req.session.userLogin });
  }
  res.status(401).json({ loggedIn: false, message: "Chưa đăng nhập" });
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Đăng xuất thất bại" });
    }

    res.clearCookie("connect.sid");
    return res.status(200).json({ message: "Đăng xuất thành công" });
  });
};

const getCurrentUser = (req, res) => {
  if (req.session.userLogin) {
    return res.status(200).json({
      success: true,
      user: req.session.userLogin
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
    });
  }
};

module.exports = {
  isLogin,
  login,
  logout,
  getCurrentUser
};
