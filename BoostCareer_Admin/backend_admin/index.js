const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const routes = require("./src/routes/routes.js");
const session = require("express-session");

//Load config từ file .env
dotenv.config();

//Cors
const corsConfig = require("./src/config/corsConfig.js");

//Session
const sessionConfig = require("./src/config/sessionConfig.js");

//Khởi tạo app express
const app = express();

app.use(express.json());
app.use(cors(corsConfig));
app.use(session(sessionConfig));

app.use(routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running at port ${PORT}`);
});
