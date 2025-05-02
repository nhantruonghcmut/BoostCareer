const express = require("express");

const {
  getCategory_Industry,
  getCategory_Jobfunction,
  getCatalog_Benefit,
  getCategory_Nation,
  getCategory_City,
  getCategory_District,
  getCategory_Language,
  getCategory_Level,
  getCategory_Scale,
  getCategory_Tags,
  getCategory_Education,
  gettime,
} = require("../controllers/categoryControllers.js");

const categoryRoutes = express.Router();

categoryRoutes.get("/category-industry", getCategory_Industry);
categoryRoutes.get("/category-jobfunction", getCategory_Jobfunction);
categoryRoutes.get("/category-benefit", getCatalog_Benefit);
categoryRoutes.get("/category-nation", getCategory_Nation);
categoryRoutes.get("/category-city", getCategory_City);
categoryRoutes.get("/category-district", getCategory_District);
categoryRoutes.get("/category-language", getCategory_Language);
categoryRoutes.get("/category-language-metric", getCategory_Language);
categoryRoutes.get("/category-level", getCategory_Level);
categoryRoutes.get("/category-scale", getCategory_Scale);
categoryRoutes.get("/category-tags", getCategory_Tags);
categoryRoutes.get("/category-education", getCategory_Education);
categoryRoutes.get("/time", gettime);
module.exports = categoryRoutes;
