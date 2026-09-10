import logger from "../utils/logger.js";
/**
 * Security middleware stack. Gọi applySecurity(app) NGAY sau khi tạo app,
 * trước mọi route.
 */
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import env from "./env.js";

const tooManyRequests = (req, res) => {
  logger.warn(`[RATE LIMIT] ${req.ip} -> ${req.method} ${req.originalUrl}`);
  return res.status(429).json({
    success: false,
    errorCode: "RATE_LIMITED",
    message: "Bạn thao tác quá nhanh, vui lòng thử lại sau ít phút.",
  });
};

const makeLimiter = ({ windowMs, max, skipSuccessfulRequests = false }) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    skipSuccessfulRequests,
    handler: tooManyRequests,
  });

/** Áp cho toàn bộ /api — chặn scraping và flood cơ bản. */
export const globalLimiter = makeLimiter({
  windowMs: env.security.rateLimitWindowMs,
  max: env.security.rateLimitMax,
});

/** Áp cho login / register / reset-password — chặn brute force. */
export const authLimiter = makeLimiter({
  windowMs: env.security.rateLimitWindowMs,
  max: env.security.authRateLimitMax,
  skipSuccessfulRequests: true,
});

/** Áp cho AI endpoint — mỗi request tốn tiền thật. */
export const aiLimiter = makeLimiter({
  windowMs: env.security.aiRateLimitWindowMs,
  max: env.security.aiRateLimitMax,
});

export const applySecurity = (app) => {
  if (env.server.trustProxy) {
    // Cần thiết để req.ip đúng khi đứng sau nginx / load balancer,
    // nếu không rate limit sẽ tính chung cho mọi client.
    app.set("trust proxy", 1);
  }

  app.disable("x-powered-by");

  app.use(
    helmet({
      // API thuần JSON: CSP mặc định của helmet không cần thiết và dễ gây nhiễu.
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: "cross-origin" },
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
      hsts: env.isProduction ? { maxAge: 15552000, includeSubDomains: true } : false,
    })
  );

  app.use(compression());
};

export default applySecurity;
