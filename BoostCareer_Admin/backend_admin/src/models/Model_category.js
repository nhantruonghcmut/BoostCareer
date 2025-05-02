const { is } = require("express/lib/request.js");
const db = require("../config/databaseConfig.js");

const queryCategory_Industry = async () => {
  const [rows] = await db.query("SELECT * FROM catalog_industry");
  return rows;
};

const queryCategory_Jobfunction = async () => {
  const [rows] = await db.query("SELECT * FROM catalog_job_function");
  return rows;
};

const queryCatalog_Benefit = async () => {
  const [rows] = await db.query("SELECT * FROM catalog_job_function");
  return rows;
};

const queryCategory_Nation = async () => {
  const [rows] = await db.query("SELECT * FROM catalog_nation");
  return rows;
};

const queryCategory_City = async () => {
  const [rows] = await db.query(
    "SELECT * FROM catalog_city"  );
  return rows;
};

const queryCategory_District = async (city) => {
  if (city) {
  const [rows] = await db.query(
    "SELECT * FROM catalog_district WHERE city_id=?",
    [city]
  );
  return rows;
}
else {
  const [rows] = await db.query(
    "SELECT * FROM catalog_district"
  );
  return rows;}

 
};

const queryCategory_Language = async () => {
  const [rows] = await db.query("SELECT * FROM catalog_language");
  return rows;
};

const queryCategory_Level = async () => {
  const [rows] = await db.query("SELECT * FROM catalog_level");
  return rows;
};

const queryCategory_Scale = async () => {
  const [rows] = await db.query("SELECT * FROM catalog_scale");
  return rows;
};

const queryCategory_Tags = async () => {
  const [rows] = await db.query("SELECT * FROM catalog_tags");
  return rows;
};

const queryCategory_Education = async () => {
  const [rows] = await db.query("SELECT * FROM catalog_education");
  return rows;
};

module.exports = {
  queryCategory_Industry,
  queryCategory_Jobfunction,
  queryCatalog_Benefit,
  queryCategory_Nation,
  queryCategory_City,
  queryCategory_District,
  queryCategory_Language,
  queryCategory_Level,
  queryCategory_Scale,
  queryCategory_Tags,
  queryCategory_Education,
};
