import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./src/routes/routes.js";
import cookieParser from 'cookie-parser';
// Import middleware
import responseHandler from './src/middlewares/responseHandler.js';
import { errorConverter, errorHandler } from './src/middlewares/errorHandler.js';
import requestLogger from './src/middlewares/requestLogger.js';
import logger from './src/utils/logger.js';

//Load config từ file .env
dotenv.config();

//Cors
import corsConfig from "./src/config/corsConfig.js";

//Khởi tạo app express
const app = express();

app.use(express.json());
app.use(cors(corsConfig));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

// Thêm middleware ghi log request
app.use(requestLogger);

// Apply middlewares (thêm vào trước các routes)
app.use(responseHandler);

app.use(routes);
app.use((req, res, next) => {
  res.status(404).json({
      status: 404,
      message: "API Not Found",
      data: null
  });
});

// Apply error handling middleware (thêm vào sau routes, trước app.listen)
app.use(errorConverter);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  const startupMessage = `Server is running at port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`;
  console.log(startupMessage);
  logger.logSystem(startupMessage, { port: PORT, environment: process.env.NODE_ENV || 'development' });
});
