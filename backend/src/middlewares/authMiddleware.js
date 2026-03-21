import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import {
  findUserByUsername,
} from "../models/authencationModels.js";
// Verify access token middleware

const generateAccessToken = (user) => {
   console.log("process.env.JWT_ACCESS_EXPIRES ", process.env.JWT_ACCESS_EXPIRES );
  return jwt.sign(
    { 
      id: user.user_id,
      username: user.username,
      role: user.role_id ,
      logo: user.logo || ''

    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: parseInt(process.env.JWT_ACCESS_EXPIRES) } 
  );
};

const verifyToken = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken) {
    // Nếu access token không tồn tại, kiểm tra refresh token
    if (!refreshToken) {
      console.log("ko có refreshToken")
      return res.status(401).json({ errorCode: "TOKEN_MISSING", message: "Access token không tồn tại" });
    }

    try {
      const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await findUserByUsername(decodedRefresh.username);

      if (!user) {
        return res.status(401).json({ errorCode: "TOKEN_INVALID", message: "Access token không hợp lệ" });
      }
      console.log("tạo access token mới cho user tại midleware:"    );
      // Tạo mới access token
      const newAccessToken = generateAccessToken(user);
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 1000, // 60 phút
      });

      req.user = user; // Gắn thông tin user vào request
      return next();    
    } 
      catch (refreshError) 
      {
      // Xóa cả hai cookie nếu refresh token không hợp lệ
      console.error(" xử lý trycatch Refresh token không hợp lệ:", refreshError);
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/"
      });
      
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/"
      });
      
      return res.status(401).json({ errorCode: "AUTH_REQUIRED", message: "Yêu cầu đăng nhập lại", forceLogout: true });
    }
  }

  // Nếu access token tồn tại, kiểm tra tính hợp lệ
  jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        console.error("accessToken đã hết hạn");
        return res.status(401).json({ errorCode: "TOKEN_EXPIRED", message: "Access token đã hết hạn" });
      }
      // Xóa cookie nếu token không hợp lệ
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/"
      });
      return res.status(401).json({ errorCode: "TOKEN_INVALID", message: "Access token không hợp lệ", forceLogout: true });
    }    req.user = decoded; // Gắn thông tin user vào request
    next();
  });
};

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

export {
  verifyToken,
  verifyRole
};