import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import env from "../config/env.js";
import logger from "../utils/logger.js";
import { accessTokenCookie, clearAuthCookies } from "../config/cookieConfig.js";
import { findUserByUsername } from "../models/authencationModels.js";

export const generateAccessToken = (user) =>
  jwt.sign(
    {
      id: user.user_id,
      username: user.username,
      role: user.role_id,
      logo: user.logo || "",
    },
    env.jwt.accessSecret,
    { expiresIn: env.jwt.accessExpires }
  );

const unauthorized = (res, errorCode, message, forceLogout = false) =>
  res.status(401).json({ errorCode, message, ...(forceLogout ? { forceLogout: true } : {}) });

const verifyToken = async (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies || {};

  // Không có access token -> thử phục hồi bằng refresh token
  if (!accessToken) {
    if (!refreshToken) {
      return unauthorized(res, "TOKEN_MISSING", "Access token không tồn tại");
    }

    try {
      const decodedRefresh = jwt.verify(refreshToken, env.jwt.refreshSecret);
      const user = await findUserByUsername(decodedRefresh.username);

      if (!user) {
        return unauthorized(res, "TOKEN_INVALID", "Access token không hợp lệ", true);
      }

      res.cookie("accessToken", generateAccessToken(user), accessTokenCookie());
      req.user = user;
      return next();
    } catch (refreshError) {
      logger.warn("Refresh token không hợp lệ", { message: refreshError.message });
      clearAuthCookies(res);
      return unauthorized(res, "AUTH_REQUIRED", "Yêu cầu đăng nhập lại", true);
    }
  }

  // Có access token -> xác thực
  try {
    req.user = jwt.verify(accessToken, env.jwt.accessSecret);
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return unauthorized(res, "TOKEN_EXPIRED", "Access token đã hết hạn");
    }
    clearAuthCookies(res);
    return unauthorized(res, "TOKEN_INVALID", "Access token không hợp lệ", true);
  }
};

const verifyRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(new ApiError("User not authenticated", 401));
  }
  if (!roles.includes(req.user.role)) {
    return next(new ApiError("Unauthorized access", 403));
  }
  return next();
};

export { verifyToken, verifyRole };
