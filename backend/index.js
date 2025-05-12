const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const routes = require("./src/routes/routes.js");
const cookieParser = require('cookie-parser');
// Import middleware
const responseHandler = require('./src/middlewares/responseHandler');
const { errorConverter, errorHandler } = require('./src/middlewares/errorHandler');

//Load config từ file .env
dotenv.config();

//Cors
const corsConfig = require("./src/config/corsConfig.js");

//Khởi tạo app express
const app = express();

app.use(express.json());
app.use(cors(corsConfig));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

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
//console\.log(`server is running at port ${PORT}`);
});
