import env from "./env.js";

const allowList = new Set(env.cors.origins);

export default {
  origin(origin, callback) {
    // Cho phép request không có Origin (curl, health check, server-to-server)
    if (!origin) return callback(null, true);
    if (allowList.has(origin)) return callback(null, true);
    return callback(new Error(`Origin không được phép bởi CORS: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Set-Cookie"],
  maxAge: 86400,
};
