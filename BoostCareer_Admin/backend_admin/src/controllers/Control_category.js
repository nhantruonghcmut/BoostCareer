const {
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
} = require("../models/Model_category.js");

const getCategory_Industry = async (req, res) => {               ///////////// SỬ DỤNG
  console.log("getCategory_Industry");
  try {
    const data = await queryCategory_Industry();
    if (data) {
      return res.status(200).json({ data });
    }
  } catch (err) {
    console.error("Có lỗi khi lấy thông tin:", err);
    res.status(500).json({ message: "Có lỗi khi lấy thông tin" });
  }
};

const getCategory_Jobfunction = async (req, res) => {                ///////////// SỬ DỤNG
  try {
    console.log("getCategory_Jobfunction");
    const data = await queryCategory_Jobfunction();
    if (data) {
      return res.status(200).json({ data });
    }
  } catch (err) {
    console.error("Có lỗi khi lấy thông tin:", err);
    res.status(500).json({ message: "Có lỗi khi lấy thông tin" });
  }
};

const getCategory_Nation = async (req, res) => {
  try {
    console.log("getCategory_Nation");
    const data = await queryCategory_Nation();
    if (data) {
      return res.status(200).json({ data });
    }
  } catch (err) {
    console.error("Có lỗi khi lấy thông tin:", err);
    res.status(500).json({ message: "Có lỗi khi lấy thông tin" });
  }
};

const getCategory_City = async (req, res) => {               ///////////// SỬ DỤNG
  try { 
    console.log("getCategory_City");
    const data = await queryCategory_City();
    if (data) {
      return res.status(200).json({ data });
    }
  } catch (err) {
    console.error("Có lỗi khi lấy thông tin:", err);
    res.status(500).json({ message: "Có lỗi khi lấy thông tin" });
  }
};

const getCategory_District = async (req, res) => {
  try {
    console.log("getCategory_District");
    const city = req.body.city;
    const data = await queryCategory_District(city);
    if (data) {
      return res.status(200).json({ data });
    }
  } catch (err) {
    console.error("Có lỗi khi lấy thông tin:", err);
    res.status(500).json({ message: "Có lỗi khi lấy thông tin" });
  }
};

const getCategory_Language = async (req, res) => {
  try {
    console.log("getCategory_Language");
    const data = await queryCategory_Language();
    if (data) {
      return res.status(200).json({ data });
    }
  } catch (err) {
    console.error("Có lỗi khi lấy thông tin:", err);
    res.status(500).json({ message: "Có lỗi khi lấy thông tin" });
  }
};

const getCategory_Level = async (req, res) => {               ///////////// SỬ DỤNG
  try {
    console.log("getCategory_Level");
    const data = await queryCategory_Level();
    if (data) {
      return res.status(200).json({ data });
    }
  } catch (err) {
    console.error("Có lỗi khi lấy thông tin:", err);
    res.status(500).json({ message: "Có lỗi khi lấy thông tin" });
  }
};

const getCategory_Scale = async (req, res) => {
  try {
    console.log("getCategory_Scale");
    const data = await queryCategory_Scale();
    if (data) {
      return res.status(200).json({ data });
    }
  } catch (err) {
    console.error("Có lỗi khi lấy thông tin:", err);
    res.status(500).json({ message: "Có lỗi khi lấy thông tin" });
  }
};

const getCategory_Tags = async (req, res) => {
  try {
    console.log("getCategory_Tags");
    const data = await queryCategory_Tags();
    if (data) {
      return res.status(200).json({ data });
    }
  } catch (err) {
    console.error("Có lỗi khi lấy thông tin:", err);
    res.status(500).json({ message: "Có lỗi khi lấy thông tin" });
  }
};
const getCatalog_Benefit = async (req, res) => {
  try {
    console.log("getCatalog_Benefit");
    const data = await queryCatalog_Benefit();
    if (data) {
      return res.status(200).json({ data });
    }
  } catch (err) {
    console.error("Có lỗi khi lấy thông tin:", err);
    res.status(500).json({ message: "Có lỗi khi lấy thông tin" });
  }
};

const getCategory_Education = async (req, res) => {
  try {
    console.log("getCategory_Education");
    const data = await queryCategory_Education();
    if (data) {
      return res.status(200).json({ data });
    }
  } catch (err) {
    console.error("Có lỗi khi lấy thông tin:", err);
    res.status(500).json({ message: "Có lỗi khi lấy thông tin" });
  }
};

module.exports = {
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
};
