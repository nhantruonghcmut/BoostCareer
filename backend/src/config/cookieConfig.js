/**
 * Một nguồn sự thật duy nhất cho cookie option.
 * Trước đây option được copy ở 8 chỗ (authController + authMiddleware),
 * lệch nhau một field là auth vỡ theo cách rất khó debug.
 */
import env from "./env.js";

const base = {
  httpOnly: true,
  secure: env.cookie.secure,
  sameSite: env.cookie.sameSite,
  path: "/",
  ...(env.cookie.domain ? { domain: env.cookie.domain } : {}),
};

export const accessTokenCookie = () => ({
  ...base,
  maxAge: env.cookie.accessMaxAgeMs,
});

export const refreshTokenCookie = () => ({
  ...base,
  maxAge: env.cookie.refreshMaxAgeMs,
});

/** clearCookie chỉ match khi option trùng nhau (trừ maxAge). */
export const clearCookieOptions = () => ({ ...base });

export const clearAuthCookies = (res) => {
  res.clearCookie("accessToken", clearCookieOptions());
  res.clearCookie("refreshToken", clearCookieOptions());
};

export default { accessTokenCookie, refreshTokenCookie, clearCookieOptions, clearAuthCookies };
