import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import env from "./src/config/env.js";
import corsConfig from "./src/config/corsConfig.js";
import { applySecurity, globalLimiter } from "./src/config/security.js";
import { pingDatabase, closeDatabase } from "./src/config/databaseConfig.js";

import routes from "./src/routes/routes.js";
import responseHandler from "./src/middlewares/responseHandler.js";
import requestLogger from "./src/middlewares/requestLogger.js";
import { errorConverter, errorHandler } from "./src/middlewares/errorHandler.js";
import logger from "./src/utils/logger.js";

const app = express();

// 1. Security trước tiên - helmet/compression/trust proxy phải chạy trước mọi thứ.
applySecurity(app);

// 2. Parsing (có giới hạn kích thước để không bị DoS bằng payload lớn).
app.use(express.json({ limit: env.server.bodyLimit }));
app.use(express.urlencoded({ extended: true, limit: env.server.bodyLimit }));
app.use(cookieParser());

// 3. CORS.
app.use(cors(corsConfig));

// 4. Observability + response helper.
app.use(requestLogger);
app.use(responseHandler);

// 5. Health check - đặt TRƯỚC rate limit để probe không bị chặn.
app.get("/health", (req, res) =>
  res.status(200).json({ status: "ok", uptime: process.uptime(), env: env.nodeEnv })
);

app.get("/ready", async (req, res) => {
  try {
    await pingDatabase();
    return res.status(200).json({ status: "ready", database: "up" });
  } catch (error) {
    logger.error("Readiness check thất bại", { message: error.message });
    return res.status(503).json({ status: "not-ready", database: "down" });
  }
});

// 6. Static + API.
app.use("/uploads", express.static("uploads", { maxAge: "1d", index: false }));
app.use("/api", globalLimiter);
app.use(routes);

// 7. 404.
app.use((req, res) =>
  res
    .status(404)
    .json({ success: false, errorCode: "NOT_FOUND", message: "API Not Found", data: null })
);

// 8. Error handling (luôn cuối cùng).
app.use(errorConverter);
app.use(errorHandler);

const server = app.listen(env.server.port, env.server.host, () => {
  logger.logSystem(`Server is running at port ${env.server.port} in ${env.nodeEnv} mode`, {
    port: env.server.port,
    host: env.server.host,
    environment: env.nodeEnv,
  });
});

// Graceful shutdown: ngừng nhận request mới, đóng pool, rồi mới thoát.
const shutdown = (signal) => async () => {
  logger.logSystem(`Nhận ${signal}, đang tắt server...`);
  server.close(async () => {
    try {
      await closeDatabase();
    } catch (error) {
      logger.error("Lỗi khi đóng MySQL pool", { message: error.message });
    }
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000).unref();
};

process.on("SIGTERM", shutdown("SIGTERM"));
process.on("SIGINT", shutdown("SIGINT"));

export default app;
