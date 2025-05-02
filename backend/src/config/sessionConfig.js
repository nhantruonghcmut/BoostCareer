const session = require("express-session");
require("dotenv").config();

const sessionConfig = {
  secret: process.env.SESSION_SECRET || "your_secret_key",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 }, // 1 ngày
};

module.exports = sessionConfig;
