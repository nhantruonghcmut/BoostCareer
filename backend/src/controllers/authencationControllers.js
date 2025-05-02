const bcrypt = require("bcrypt");
const ApiError = require("../utils/ApiError");
const {
  findUserByUsername,
  loginExecute,
  registerExecute
} = require("../models/authencationModels.js");

/**
 * Xử lý đăng nhập
 */
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body.params;

    // Kiểm tra dữ liệu đầu vào
    if (!username || !password) {
      throw new ApiError("Tài khoản hoặc mật khẩu không đúng.", 400);
    }

    // Tìm người dùng trong cơ sở dữ liệu
    const user = await findUserByUsername(username);

    if (!user) {
      throw new ApiError("Tài khoản hoặc mật khẩu không đúng.", 401);
    }

    const userLogin = await loginExecute(username, password);
    // console.log("userLogin", userLogin);
    if (!userLogin) {
      throw new ApiError("Tài khoản hoặc mật khẩu không đúng.", 401);
    }

    const token = "token";
    req.session.userLogin = {
      id: userLogin.user_id,
      username: userLogin.username,
      role: userLogin.role_id,
      logo: userLogin.logo||"",
      create_date: userLogin.create_at,
    };
    // console.log("username", username);
    // Trả về thành công sử dụng res.success
    // console.log("userLogin", req.session.userLogin);
    return res.success(
      {
        user: req.session.userLogin, 
        token: token
      }, 
      "Đăng nhập thành công.",
      200
    );
  } catch (error) {
    // Xử lý các lỗi không xác định
    if (!(error instanceof ApiError)) {
      return next(new ApiError("Có lỗi khi đăng nhập.", 500));
    }
    return next(error);
  }
};

/**
 * Kiểm tra trạng thái đăng nhập
 */
const isLogin = (req, res, next) => {
  // console.log("check login");
  try {
    if (req.session.userLogin) {
      return res.success(
        { isLogin: true, user: req.session.userLogin },
        "Đã đăng nhập",
        200
      );
    }
    
    return res.success(
      { isLogin: false },
      "Chưa đăng nhập",
      200
    );
  } catch (error) {
    return next(new ApiError("Lỗi kiểm tra trạng thái đăng nhập", 500));
  }
};

/**
 * Xử lý đăng xuất
 */
const logout = (req, res, next) => {
  try {
    console.log("logout", req.session);
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return next(new ApiError("Đăng xuất thất bại", 500));
    }

    res.clearCookie("connect.sid");
    return res.success(null, "Đăng xuất thành công", 200);
  });
}
  catch (error) {
    return next(new ApiError("Có lỗi khi đăng xuất.", 500));
  }
};

/**
 * Xử lý đăng ký tài khoản
 */
const register = async (req, res, next) => {
  try {
    const data = req.body.params;
    console.log(data);
    // Kiểm tra dữ liệu đầu vào
    const { role, username, name, password, email, phone,...prop } = data;
    if (!role || !username || !name || !password || !email || !phone) {
      throw new ApiError("Thiếu thông tin đăng ký", 400);
    }


    
    // Logic đăng ký sẽ được triển khai sau
    // ...
    const user_id  = await registerExecute(
      role,
      username,
      name,
      password,
      email,
      phone
    );
    if (!user_id) {
      throw new ApiError("Đăng ký không thành công", 500);
    }    
    return res.success(
      { registered: true },
      "Đăng ký thành công",
      200
    );
  } catch (error) {
    if (!(error instanceof ApiError)) {
      return next(new ApiError("Có lỗi khi đăng ký.", 500));
      // return next(new ApiError(error, 500));
    }
    return next(error);
  }
};

module.exports = {
  isLogin,
  login,
  logout,
  register,
};
