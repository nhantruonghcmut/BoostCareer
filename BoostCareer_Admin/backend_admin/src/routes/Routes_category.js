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
} = require("../controllers/Control_category.js");

const Routes_category = express.Router();

Routes_category.get("/getCategory_Industry", getCategory_Industry);
Routes_category.get("/getCategory_Jobfunction", getCategory_Jobfunction);
Routes_category.get("/getCatalog_Benefit", getCatalog_Benefit);
Routes_category.get("/getCategory_Nation", getCategory_Nation);
Routes_category.get("/getCategory_City", getCategory_City);
Routes_category.get("/getCategory_District", getCategory_District);
Routes_category.get("/getCategory_Language", getCategory_Language);
Routes_category.get("/getCategory_Level", getCategory_Level);
Routes_category.get("/getCategory_Scale", getCategory_Scale);
Routes_category.get("/getCategory_Tags", getCategory_Tags);
Routes_category.get("/getCategory_Education", getCategory_Education);

module.exports = Routes_category;
