const ApiError = require('../utils/ApiError.js');
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
} = require("../models/categoryModels.js");

/**
 * Lấy danh sách ngành nghề
 */
const getCategory_Industry = async (req, res, next) => {
  try {
    const data = await queryCategory_Industry();
    return res.success(data || [], "Lấy danh sách ngành nghề thành công");
  } catch (err) {
    return next(new ApiError("Có lỗi khi lấy thông tin ngành nghề", 500));
  }
};

/**
 * Lấy danh sách chức năng công việc
 */
const getCategory_Jobfunction = async (req, res, next) => {
  try {
    const data = await queryCategory_Jobfunction();
    return res.success(data || [], "Lấy danh sách chức năng công việc thành công");
  } catch (err) {
    return next(new ApiError("Có lỗi khi lấy thông tin chức năng công việc", 500));
  }
};

/**
 * Lấy danh sách quốc gia
 */
const getCategory_Nation = async (req, res, next) => {
  try {
    const data = await queryCategory_Nation();
    return res.success(data || [], "Lấy danh sách quốc gia thành công");
  } catch (err) {
    return next(new ApiError("Có lỗi khi lấy thông tin quốc gia", 500));
  }
};

/**
 * Lấy danh sách thành phố theo quốc gia
 */
const getCategory_City = async (req, res, next) => {
  try {
    // console.log("req.query", req.query);
    const nation = req.query?.nation || 84;
    
    if (!nation) {
      return next(new ApiError("Thiếu thông tin mã quốc gia", 400));
    }    
    const data = await queryCategory_City(nation);
    // console.log("nation", data);
    return res.success(data || [], "Lấy danh sách thành phố thành công");
  } catch (err) {
    return next(new ApiError("Có lỗi khi lấy thông tin thành phố", 500));
  }
};

/**
 * Lấy danh sách quận/huyện theo thành phố
 */
const getCategory_District = async (req, res, next) => {
  try {
    const { city } = req.query;
    
    if (!city) {
      return next(new ApiError("Thiếu thông tin mã thành phố", 400));
    }
    
    const data = await queryCategory_District(city);
    return res.success(data || [], "Lấy danh sách quận/huyện thành công");
  } catch (err) {
    return next(new ApiError("Có lỗi khi lấy thông tin quận/huyện", 500));
  }
};

/**
 * Lấy danh sách ngôn ngữ
 */
const getCategory_Language = async (req, res, next) => {
  try {
    const data = await queryCategory_Language();
    return res.success(data || [], "Lấy danh sách ngôn ngữ thành công");
  } catch (err) {
    return next(new ApiError("Có lỗi khi lấy thông tin ngôn ngữ", 500));
  }
};

/**
 * Lấy danh sách cấp độ
 */
const getCategory_Level = async (req, res, next) => {
  try {
    const data = await queryCategory_Level();
    return res.success(data || [], "Lấy danh sách cấp độ thành công");
  } catch (err) {
    return next(new ApiError("Có lỗi khi lấy thông tin cấp độ", 500));
  }
};

/**
 * Lấy danh sách quy mô công ty
 */
const getCategory_Scale = async (req, res, next) => {
  try {
    const data = await queryCategory_Scale();
    return res.success(data || [], "Lấy danh sách quy mô công ty thành công");
  } catch (err) {
    return next(new ApiError("Có lỗi khi lấy thông tin quy mô công ty", 500));
  }
};

/**
 * Lấy danh sách tags
 */
const getCategory_Tags = async (req, res, next) => {
  try {
    const data = await queryCategory_Tags();
    return res.success(data || [], "Lấy danh sách tags thành công");
  } catch (err) {
    return next(new ApiError("Có lỗi khi lấy thông tin tags", 500));
  }
};

/**
 * Lấy danh sách phúc lợi
 */
const getCatalog_Benefit = async (req, res, next) => {
  try {
    const data = await queryCatalog_Benefit();
    return res.success(data || [], "Lấy danh sách phúc lợi thành công");
  } catch (err) {
    return next(new ApiError("Có lỗi khi lấy thông tin phúc lợi", 500));
  }
};

/**
 * Lấy danh sách trình độ học vấn
 */
const getCategory_Education = async (req, res, next) => {
  try {
    const data = await queryCategory_Education();
    return res.success(data || [], "Lấy danh sách trình độ học vấn thành công");
  } catch (err) {
    return next(new ApiError("Có lỗi khi lấy thông tin trình độ học vấn", 500));
  }
};

/**
 * Lấy thời gian hiện tại
 */
const gettime = (req, res, next) => {
  try {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, "0");
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const year = today.getFullYear();
    const currentDate = `${day}/${month}/${year}`;

    return res.success({ data: currentDate }, "Lấy thời gian hiện tại thành công");
  } catch (err) {
    return next(new ApiError("Có lỗi khi lấy thông tin thời gian", 500));
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
  gettime
};
