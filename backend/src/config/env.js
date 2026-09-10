/**
 * Centralised environment loading + validation.
 *
 * Quy tắc: app KHÔNG được boot với config sai. Thiếu biến bắt buộc thì
 * chết ngay lúc khởi động kèm thông báo rõ, thay vì lỗi mơ hồ lúc runtime.
 */
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const errors = [];

const raw = (key) => {
  const value = process.env[key];
  return typeof value === "string" ? value.trim() : value;
};

const str = (key, { required = false, fallback = undefined } = {}) => {
  const value = raw(key);
  if (value === undefined || value === "") {
    if (required) errors.push(`Missing required env: ${key}`);
    return fallback;
  }
  return value;
};

const int = (key, { required = false, fallback = undefined, min, max } = {}) => {
  const value = raw(key);
  if (value === undefined || value === "") {
    if (required) errors.push(`Missing required env: ${key}`);
    return fallback;
  }
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    errors.push(`Env ${key} must be an integer, received "${value}"`);
    return fallback;
  }
  if (min !== undefined && parsed < min) {
    errors.push(`Env ${key} must be >= ${min}, received ${parsed}`);
  }
  if (max !== undefined && parsed > max) {
    errors.push(`Env ${key} must be <= ${max}, received ${parsed}`);
  }
  return parsed;
};

const bool = (key, fallback = false) => {
  const value = raw(key);
  if (value === undefined || value === "") return fallback;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
};

const list = (key, fallback = []) => {
  const value = raw(key);
  if (!value) return fallback;
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const nodeEnv = str("NODE_ENV", { fallback: "development" });
const isProduction = nodeEnv === "production";
const isDevelopment = nodeEnv === "development";
const isTest = nodeEnv === "test";

const env = {
  nodeEnv,
  isProduction,
  isDevelopment,
  isTest,

  server: {
    host: str("HOST", { fallback: "0.0.0.0" }),
    port: int("PORT", { fallback: 4000, min: 1, max: 65535 }),
    bodyLimit: str("BODY_LIMIT", { fallback: "1mb" }),
    trustProxy: bool("TRUST_PROXY", isProduction),
  },

  cors: {
    // Hỗ trợ nhiều origin: CORS_ORIGINS="https://a.com,https://b.com"
    origins: list("CORS_ORIGINS", [
      str("FRONTEND_URL", { fallback: "http://localhost:3000" }),
      str("CLIENT_URL", { fallback: "" }),
    ].filter(Boolean)),
  },

  cookie: {
    // "lax" cho same-site dev, "none" khi FE/BE khác domain (bắt buộc secure=true)
    sameSite: str("COOKIE_SAMESITE", { fallback: "lax" }),
    secure: bool("COOKIE_SECURE", isProduction),
    domain: str("COOKIE_DOMAIN", { fallback: undefined }),
    accessMaxAgeMs: int("COOKIE_ACCESS_MAX_AGE_MS", { fallback: 60 * 60 * 1000 }),
    refreshMaxAgeMs: int("COOKIE_REFRESH_MAX_AGE_MS", { fallback: 7 * 24 * 60 * 60 * 1000 }),
  },

  jwt: {
    accessSecret: str("JWT_ACCESS_SECRET", { required: true }),
    refreshSecret: str("JWT_REFRESH_SECRET", { required: true }),
    accessExpires: int("JWT_ACCESS_EXPIRES", { fallback: 3600, min: 60 }),
    refreshExpires: int("JWT_REFRESH_EXPIRES", { fallback: 604800, min: 60 }),
  },

  db: {
    host: str("MYSQL_HOST", { required: true }),
    port: int("MYSQL_PORT", { fallback: 3306, min: 1, max: 65535 }),
    user: str("MYSQL_USER", { required: true }),
    password: str("MYSQL_PASSWORD", { fallback: "" }),
    database: str("MYSQL_DB", { required: true }),
    connectionLimit: int("MYSQL_CONNECTION_LIMIT", { fallback: 10, min: 1, max: 200 }),
    queueLimit: int("MYSQL_QUEUE_LIMIT", { fallback: 0, min: 0 }),
    connectTimeout: int("MYSQL_CONNECT_TIMEOUT", { fallback: 20000, min: 1000 }),
  },

  s3: {
    region: str("AWS_REGION", { fallback: "" }),
    bucket: str("AWS_BUCKET_NAME", { fallback: "" }),
    accessKeyId: str("AWS_ACCESS_KEY_ID", { fallback: "" }),
    secretAccessKey: str("AWS_SECRET_ACCESS_KEY", { fallback: "" }),
  },

  upload: {
    imageMaxBytes: int("UPLOAD_IMAGE_MAX_BYTES", { fallback: 5 * 1024 * 1024, min: 1024 }),
    cvMaxBytes: int("UPLOAD_CV_MAX_BYTES", { fallback: 10 * 1024 * 1024, min: 1024 }),
    // Bật khi TẤT CẢ read-path của CV đã dùng presigned URL (xem Phase 1C).
    privateCv: bool("S3_CV_PRIVATE", false),
    signedUrlTtlSeconds: int("S3_SIGNED_URL_TTL", { fallback: 900, min: 60, max: 604800 }),
  },

  security: {
    rateLimitWindowMs: int("RATE_LIMIT_WINDOW_MS", { fallback: 15 * 60 * 1000, min: 1000 }),
    rateLimitMax: int("RATE_LIMIT_MAX", { fallback: 300, min: 1 }),
    authRateLimitMax: int("AUTH_RATE_LIMIT_MAX", { fallback: 20, min: 1 }),
    aiRateLimitWindowMs: int("AI_RATE_LIMIT_WINDOW_MS", { fallback: 60 * 1000, min: 1000 }),
    aiRateLimitMax: int("AI_RATE_LIMIT_MAX", { fallback: 10, min: 1 }),
    saltRounds: int("PASSWORD_SALT_ROUNDS", { fallback: 10, min: 4, max: 15 }),
  },
};

if (env.cookie.sameSite === "none" && !env.cookie.secure) {
  errors.push('COOKIE_SAMESITE="none" requires COOKIE_SECURE=true');
}

if (errors.length > 0) {
  const message = [
    "",
    "Invalid environment configuration:",
    ...errors.map((line) => `  - ${line}`),
    "",
    "Check backend/.env against backend/.env.example.",
    "",
  ].join("\n");
  throw new Error(message);
}

export default env;
