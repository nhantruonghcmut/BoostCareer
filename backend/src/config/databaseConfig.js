import mysql from "mysql2/promise";
import env from "./env.js";
import logger from "../utils/logger.js";

const db = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  waitForConnections: true,
  connectionLimit: env.db.connectionLimit,
  queueLimit: env.db.queueLimit,
  connectTimeout: env.db.connectTimeout,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  timezone: "Z",
});

logger.logSystem("MySQL pool created", {
  host: env.db.host,
  port: env.db.port,
  database: env.db.database,
  connectionLimit: env.db.connectionLimit,
});

/** Dùng cho /ready — xác nhận DB thật sự trả lời được. */
export const pingDatabase = async () => {
  const connection = await db.getConnection();
  try {
    await connection.query("SELECT 1");
    return true;
  } finally {
    connection.release();
  }
};

export const closeDatabase = async () => {
  await db.end();
  logger.logSystem("MySQL pool closed");
};

export default db;
