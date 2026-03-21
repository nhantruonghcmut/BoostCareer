// import  uploadToS3  from "../middlewares/imageUpload.js";
import ApiError from "../utils/ApiError.js";
import {
  queryGetPublicInformationOfCompany,
  queryGetPublicJobDetail,
  queryGetListJobBySearch,
  queryGetListJobOfCompany,
  queryGetListLeadingCompany,
  queryGetListCompanyBySearch,
  queryGetGeneralInfo,
  queryGetRelatedJobs
} from "../models/guestModels.js";

const getPublicJobDetail = async (req, res, next) => {
  try {
    const {job_id} = req.query;

    if (!job_id) {
      return next(new ApiError("Thiếu ID bài đăng", 400));
    }

    const data = await queryGetPublicJobDetail(job_id);

    if (!data || data.length === 0) {
      return next(new ApiError("Không tìm thấy bài đăng", 404));
    }
      // console.log("data", data);
    return res.success(data, "Lấy chi tiết bài đăng thành công");
  } catch (err) {
    return next(new ApiError("Lỗi khi lấy chi tiết bài đăng", 500));
  }
};
// const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// await delay(5000); // Giả lập độ trễ 5 giây
const getListJobBySearch = async (req, res, next) => {
      try {
      const searchData = req.query;
      // console.log("searchData", searchData);
      if (!searchData) {
        return next(new ApiError("Thiếu thông tin filter", 400));
      }
      const paging_size = Number(searchData?.paging_size) || 10;

      const data = await queryGetListJobBySearch(searchData);

      const total_count = data.length > 0 ? data[0].total_count : 0;
      const totalWorksPages = Math.ceil(total_count / paging_size);

      return res.success(
        {jobs: data || [], totalWorksPages,total_count},
        "Tìm kiếm bài đăng thành công"
      );
    } catch (err) {
      return next(new ApiError("Lỗi khi tìm kiếm bài đăng", 500));
    }
};

const getListJobOfCompany = async (req, res, next) => {
  try {
    const company_id = req.query.id;
    // console.log("company_id", company_id);
    if (!company_id) {
      return next(new ApiError("Thiếu ID bài đăng", 400));
    }
    const data = await queryGetListJobOfCompany(company_id);
    if (!data || data.length === 0) {
      return next(new ApiError("Không tìm thấy bài đăng", 404));
    }

    const totalJobs = data.length > 0 ? data[0].total_count : 0;
    return res.success(
      {jobs: data || [], totalJobs},
      "Tìm kiếm bài đăng thành công"
    );
  } catch (err) {
    return next(new ApiError("Lỗi khi tìm kiếm bài đăng", 500));
  }


};

const getListLeadingCompany = async (req, res, next) => {
  try {
    const paging_size = Number(req.query?.paging_size)||20;
    // console.log("paging_size", paging_size);
    const data = await queryGetListLeadingCompany(paging_size);  
    const total_count = data.length > 0 ? data[0].total_count : 0;
    const totalWorksPages = Math.ceil(total_count / paging_size);
  
    return res.success(
      {companies: data || [], totalWorksPages},
      "Tìm kiếm bài đăng thành công"
    );
  } catch (err) {
    return next(new ApiError("Lỗi khi tìm kiếm bài đăng", 500));
  }
};

const getListCompanyBySearch = async (req, res, next) => {
try {
  const searchData = req.query;
  // console.log("searchData", searchData);
  if (!searchData) {
    return next(new ApiError("Thiếu thông tin filter", 400));
  }
  const paging_size = Number(searchData?.paging_size) || 10;

  const data = await queryGetListCompanyBySearch(searchData);

  const total_count = data.length > 0 ? data[0].total_count : 0;
  const totalPages = Math.ceil(total_count / paging_size);

  return res.success(
    {companies: data || [], totalPages},
    "Tìm kiếm bài đăng thành công"
  );
} catch (err) {
  return next(new ApiError("Lỗi khi tìm kiếm bài đăng", 500));
}
};

const getPublicInformationOfCompany = async (req, res, next) => {
  try {
    // console.log("id", req.query);
    const id = req.query.id;
    if (!id) {
      return next(new ApiError("Thiếu thông tin ID công ty", 400));
    }

    const companyInfor = await queryGetPublicInformationOfCompany(id);
    return res.success(companyInfor || {}, "Lấy thông tin công ty thành công");
  } catch (err) {
    return next(new ApiError("Có lỗi khi lấy thông tin công ty", 500));
  }
};

const getGeneralInfo = async (req, res, next) => {
  try {
    const data = await queryGetGeneralInfo();
    // console.log("data", data);
    return res.success(data || {}, "Lấy thông tin tổng quan thành công");
  } catch (err) {
    return next(new ApiError("Có lỗi khi lấy thông tin công ty", 500));
  }
};
const getRelatedJobs = async (req, res, next) => {
try {
  const {job_id} = req.query;
  if (!job_id) {
    return next(new ApiError("Thiếu ID bài đăng", 400));
  }
  const data = await queryGetRelatedJobs(job_id);
  // if (!data || data.length === 0) {
  //   return next(new ApiError("Không tìm thấy bài đăng", 404));
  // }
  return res.success(data||[], " getRelatedJobs thành công");
}
catch (err) {
  return next(new ApiError("Lỗi khi getRelatedJobs", 500));
}
};

export {
  getPublicInformationOfCompany,
  getPublicJobDetail,
  getListJobBySearch,
  getListJobOfCompany,
  getListLeadingCompany,
  getListCompanyBySearch,
  getGeneralInfo,
  getRelatedJobs
};
