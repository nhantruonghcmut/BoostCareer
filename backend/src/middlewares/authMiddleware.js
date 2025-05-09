const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

// Verify access token middleware
const verifyToken = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken) {
    // Nếu access token không tồn tại, kiểm tra refresh token
    if (!refreshToken) {
      return res.status(401).json({ errorCode: "TOKEN_MISSING", message: "Access token không tồn tại" });
    }

    try {
      const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await findUserByUsername(decodedRefresh.username);

      if (!user) {
        throw new ApiError("User không tồn tại", 401);
      }

      // Tạo mới access token
      const newAccessToken = generateAccessToken(user);
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60 * 1000, // 15 phút
      });

      req.user = user; // Gắn thông tin user vào request
      return next();
    } catch (refreshError) {
      return res.status(401).json({ errorCode: "REFRESH_TOKEN_INVALID", message: "Refresh token không hợp lệ" });
    }
  }

  // Nếu access token tồn tại, kiểm tra tính hợp lệ
  jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ errorCode: "TOKEN_EXPIRED", message: "Access token đã hết hạn" });
      }
      return res.status(401).json({ errorCode: "TOKEN_INVALID", message: "Access token không hợp lệ" });
    }

    req.user = decoded; // Gắn thông tin user vào request
    next();
  });
};

module.exports = { verifyToken };

// Role-based access control middleware
const verifyRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError('User not authenticated', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError('Unauthorized access', 403));
    }

    next();
  };
};

module.exports = {
  verifyToken,
  verifyRole
};