const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const {
  findUserByUsername,
  loginExecute,
  registerExecute,
  generateTokens,
} = require("../models/authencationModels.js");

const generateAccessToken = (user) => {
  return jwt.sign(
    { 
      id: user.user_id,
      username: user.username,
      role: user.role_id ,
      logo: user.logo || ''

    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { 
      id: user.user_id,
      username: user.username,
      role: user.role_id ,
      logo: user.logo || ''
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d' }
  );
};

const setTokenCookies = (res, accessToken, refreshToken) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: (parseInt(process.env.JWT_ACCESS_EXPIRES) || 900) * 1000 // 15 minutes
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: (parseInt(process.env.JWT_REFRESH_EXPIRES) || 604800) * 1000 // 7 days
  });
};

/**
 * Xử lý đăng nhập
 */
const login = async (req, res, next) => {
  console.log("Login request received", req.body);
  try {
    const { username, password } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!username || !password) {
      throw new ApiError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.", 400);
    }

    // Tìm người dùng trong cơ sở dữ liệu
    const user = await findUserByUsername(username);

    if (!user) {
      throw new ApiError("Tài khoản không tồn tại.", 401);
    }

    const userLogin = await loginExecute(username, password);
    
    if (!userLogin) {
      throw new ApiError("Mật khẩu không chính xác.", 401);
    }

    const accessToken = generateAccessToken(userLogin);
    const refreshToken = generateRefreshToken(userLogin);

    setTokenCookies(res, accessToken, refreshToken);
    
    return res.success(
      {
        user: {
          id: userLogin.user_id,
          username: userLogin.username, 
          role: userLogin.role_id,
          logo: userLogin.logo || '',
        },
        accessToken: accessToken
      },
      'Đăng nhập thành công',
      200  
    );
  } catch (error) {
    console.error("Login error:", error);
    // Xử lý các lỗi không xác định
    if (!(error instanceof ApiError)) {
      return next(new ApiError(error.message || "Có lỗi xảy ra khi đăng nhập.", 500));
    }
    return next(error);
  }
};

/**
 * Kiểm tra trạng thái đăng nhập
 */
const isLogin = async (req, res, next) => {
  console.log("Check isLogin", req.cookies.accessToken);
  try {
    const accessToken = req.cookies.accessToken;
    
    if (!accessToken) {
      return res.success(
        { isLogin: false },
        "Chưa đăng nhập",
        200
      );
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
      console.log("Check decoded", decoded);
      const user = await findUserByUsername(decoded.username);

      if (!user) {
        return res.success(
          { isLogin: false },
          "Token không hợp lệ",
          200
        );
      }

      return res.success(
        { 
          isLogin: true,
          user: {
            id: user.user_id,
            username: user.username,
            role: user.role_id,
            logo: user.logo || ''
          }
        },
        "Đã đăng nhập",
        200
      );
    } catch (tokenError) {
      if (tokenError.name === 'TokenExpiredError') {
        // Try to refresh using refresh token
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
          return res.success(
            { isLogin: false },
            "Token hết hạn và không có refresh token",
            200
          );
        }

        try {
          const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
          const user = await findUserByUsername(decoded.username);

          if (!user) {
            return res.success(
              { isLogin: false },
              "Token không hợp lệ",
              200
            );
          }

          const newAccessToken = generateAccessToken(user);
          const newRefreshToken = generateRefreshToken(user);

          setTokenCookies(res, newAccessToken, newRefreshToken);

          return res.success(
            { 
              isLogin: true,
              user: {
                id: user.user_id,
                username: user.username,
                role: user.role_id,
                logo: user.logo || ''
              }
            },
            "Token đã được làm mới",
            200
          );
        } catch (refreshError) {
          return res.success(
            { isLogin: false },
            "Refresh token không hợp lệ hoặc đã hết hạn",
            200
          );
        }
      }

      return res.success(
        { isLogin: false },
        "Token không hợp lệ",
        200
      );
    }
  } catch (error) {
    return next(new ApiError("Lỗi kiểm tra trạng thái đăng nhập", 500));
  }
};


/**
 * Xử lý đăng xuất
 */
const logout = (req, res, next) => {
  try {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });
    
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });
    
    return res.success(
      { logout: true },
      "Đăng xuất thành công",
      200
    );
  } catch (error) {
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

/**
 * Refresh token
 */
const refreshToken = async (req, res, next) => {
  console.log("Refresh token request received", req.body.params);
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      throw new ApiError("Refresh token không tồn tại", 401);
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await findUserByUsername(decoded.username);

    if (!user) {
      throw new ApiError("User không tồn tại", 401);
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    setTokenCookies(res, newAccessToken, newRefreshToken);

    return res.success(
      { message: "Token đã được làm mới" },
      "Làm mới token thành công",
      200
    );
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new ApiError("Refresh token không hợp lệ hoặc đã hết hạn", 401));
    }
    return next(new ApiError("Lỗi khi làm mới token", 500));
  }
};

// Check login status controller
const checkLoginStatus = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    
    if (!accessToken) {
      return res.success({ isLogin: false }, "Not logged in");
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
      const user = await findUserByUsername(decoded.username);

      if (!user) {
        return res.success({ isLogin: false }, "Invalid token");
      }

      return res.success({
        isLogin: true,
        user: {
          id: user.user_id,
          username: user.username,
          role: user.role_id,
          logo: user.logo || ''
        }
      }, "Logged in");
    } catch (tokenError) {
      if (tokenError.name === 'TokenExpiredError') {
        return res.success({ isLogin: false }, "Token expired");
      }
      return res.success({ isLogin: false }, "Invalid token");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  isLogin,
  login,
  logout,
  register,
  refreshToken,
  checkLoginStatus
};
