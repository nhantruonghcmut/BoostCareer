const ApiError = require('../utils/ApiError');
const bcrypt = require("bcrypt");
// const {loginExecute} = require("../models/authencationModels.js");
const { uploadImgToS3_employer, deleteFileFromS3 } = require("../middlewares/imageUpload.js");

const {
  queryGetListJobseekerBySearch,
  queryGetJobseekerDetail,
  queryGetListJobByUser,
  queryGetJobDetailByUser,
  queryAddJobByUser,
  queryUpdateJobByUser,
  queryDeleteJobByUser,
  queryGetCompanyInformation,
  queryAddItemCompanyProfile,
  queryUpdateItemCompanyProfile,
  queryDeleteItemCompanyProfile,
  queryUpdateLogoImage,
  queryUpdateBackgroundImage,
  queryGetListCandidateSaving,
  querySaveCandidate,
  queryRateCandidate,
  queryDeleteCandidate,
  queryGetListJobApplication,
  queryRejectJobApplication,
  queryInviteJobseekerApply,  
  queryGetListInvitaion,
  queryDeleteInvitation,
  queryGetListJobForInvite,
  queryGetOverview,
  queryGetNotification,
  queryUpdateReadNotification,
  queryChangePassword,
} = require("../models/employerModels.js");


//////////////////////////////////////////////////////////////
const getListJobseekerBySearch = async (req, res, next) => {
  try {
    const searchData = req.query;
    // console.log("searchData", searchData);
    if (!searchData) {
      return next(new ApiError("Thiếu thông tin tìm kiếm", 400));
    }
    const paging_size = Number(searchData?.paging_size) || 10;

    const data = await queryGetListJobseekerBySearch(searchData);

    const total_count = data.length > 0 ? data[0].total_count : 0;
    const totalPages = Math.ceil(total_count / paging_size);

    return res.success(
      { jobseekers: data || [], totalPages,total_count },
      "Tìm kiếm ứng viên thành công"
    );
  } catch (err) {
    return next(new ApiError("Lỗi khi tìm kiếm ứng viên", 500));
  }
};

const getJobseekerDetail = async (req, res, next) => {
  try {
    const employer_id = req.user.id;
    const {jobseeker_id} = req.query;
    
    if (!jobseeker_id || !employer_id) {
      return next(new ApiError("Thiếu ID ứng viên", 400));
    }
    const data = await queryGetJobseekerDetail(employer_id,jobseeker_id);

    if (!data) {
      return next(new ApiError("Không tìm thấy thông tin ứng viên", 404));
    }

    return res.success(data, "Lấy thông tin ứng viên thành công");
  } catch (err) {
    return next(new ApiError("Lỗi khi lấy thông tin ứng viên", 500));
  }
};

const getJobseekerCV = async (req, res, next) => {
  try {
    const jobseeker_id = req.query.jobseeker_id;
    
    if (!jobseeker_id) {
      return next(new ApiError("Thiếu ID ứng viên", 400));
    }
    const data = await queryGetJobseekerCV(jobseeker_id);

    if (!data) {
      return next(new ApiError("Không tìm thấy CV của ứng viên", 404));
    }

    return res.success(data, "Lấy CV ứng viên thành công");
  } catch (err) {
    return next(new ApiError("Lỗi khi lấy CV ứng viên", 500));
  }
};

const getListJobByUser = async (req, res, next) => {
  try {
    const employer_id = req.user.id;
    
    if (!employer_id) {
      return next(new ApiError("Thiếu ID nhà tuyển dụng", 400));
    }
    const data = await queryGetListJobByUser(employer_id);

    return res.success(
      { jobs: data || [] },
      "Lấy danh sách việc làm thành công"
    );
  } catch (err) {
    return next(new ApiError("Lỗi khi lấy danh sách việc làm", 500));
  }
};

const getJobDetailByUser = async (req, res, next) => {
  try {
    const employer_id = req.user.id;
    const { job_id } = req.query;
    
    if (!job_id || !employer_id) {
      return next(new ApiError("Thiếu thông tin ID bài đăng hoặc nhà tuyển dụng", 400));
    }
    
    const data = await queryGetJobDetailByUser(job_id, employer_id);

    if (!data) {
      return next(new ApiError("Không tìm thấy bài đăng", 404));
    }

    return res.success(data[0], "Lấy chi tiết bài đăng thành công");
  } catch (err) {
    return next(new ApiError("Lỗi khi lấy chi tiết bài đăng", 500));
  }
};

const addJobByUser = async (req, res, next) => {
  try {
    const employer_id = req.user.id;
    const data = req.body;
    
    if (!data || !employer_id) {
      return next(new ApiError("Thiếu thông tin bài đăng", 400));
    }    
    
    const job_id = await queryAddJobByUser({...data, employer_id});
    
    if (!job_id) {
      return next(new ApiError("Đăng bài thất bại", 500));
    }
    
    return res.success({ job_id }, "Đăng bài thành công");
  } catch (err) {
    return next(new ApiError("Lỗi khi đăng bài tuyển dụng", 500));
  }
};

const updateJobByUser = async (req, res, next) => {
  try {
    const employer_id = req.user.id;
    const data = req.body;
    
    if (!data) {
      return next(new ApiError("Thiếu thông tin bài đăng", 400));
    }  
    
    const result = await queryUpdateJobByUser({...data, employer_id});
    if (!result) {
      return next(new ApiError("Cập nhật bài đăng thất bại", 500));
    }
    
    return res.success({ }, "Cập nhật bài đăng thành công");
  } catch (err) {
    return next(new ApiError("Lỗi khi cập nhật bài đăng", 500));
  }
};

const deleteJobByUser = async (req, res, next) => {
  try {
    const employer_id = req.user.id;
    const {job_id } = req.body;
    // console.log("deleteJobByUser", req.query);
    if (!job_id || !employer_id) {
      return next(new ApiError("Thiếu thông tin ID bài đăng hoặc nhà tuyển dụng", 400));
    }
        
    const result = await queryDeleteJobByUser(employer_id,job_id);
    
    if (!result) {
      return next(new ApiError("Xóa bài đăng thất bại", 404));
    }
    
    return res.success({ job_id }, "Xóa bài đăng thành công");
  } catch (err) {
    return next(new ApiError("Lỗi khi xóa bài đăng", 500));
  }
};

const getCompanyInformation = async (req, res, next) => {
  try {
    const company_id = req.user.id;
    
    if (!company_id) {
      return next(new ApiError("Thiếu ID công ty", 400));
    }
    
    const data = await queryGetCompanyInformation(company_id);
    
    if (!data) {
      return next(new ApiError("Không tìm thấy thông tin công ty", 404));
    }
    
    return res.success(data, "Lấy thông tin công ty thành công");
  } catch (err) {
    return next(new ApiError("Lỗi khi lấy thông tin công ty", 500));
  }
};

const addItemCompanyProfile = async (req, res, next) => {
  try {
    const  company_id= req.user.id;
    const {type,data} = req.body;
    
    if (!company_id || !type) {
      return next(new ApiError("Thiếu thông tin công ty hoặc loại hồ sơ", 400));
    }
    
    const result = await queryAddItemCompanyProfile(type,{...data,company_id});
    
    if (!result) {
      return next(new ApiError("Thêm thông tin hồ sơ thất bại", 500));
    }
    
    return res.success({}, "Thêm thông tin hồ sơ thành công");
  } catch (err) {
    return next(new ApiError("Lỗi khi thêm thông tin hồ sơ công ty", 500));
  }
};

const updateItemCompanyProfile = async (req, res, next) => {
  try {
    const company_id= req.user.id;
    const {type,data} = req.body;
    
    if (!company_id|| !type) {
      return next(new ApiError("Thiếu thông tin công ty hoặc ID hồ sơ", 400));
    }
    
    const result = await queryUpdateItemCompanyProfile(type,{...data,company_id});
    
    if (!result) {
      return next(new ApiError("Cập nhật hồ sơ thất bại", 500));
    }
    
    return res.success({ }, "Cập nhật hồ sơ thành công");
  } catch (err) {
    return next(new ApiError("Lỗi khi cập nhật hồ sơ công ty", 500));
  }
};

const deleteItemCompanyProfile = async (req, res, next) => {
  try {
    const company_id= req.user.id;
    const {type,id} = req.query;
    // console.log("deleteItemCompanyProfile", req.query);
    
    if (!company_id|| !type||!id) {
      return next(new ApiError("Thiếu thông tin ID hồ sơ hoặc công ty", 400));
    }
    
    
    const result = await queryDeleteItemCompanyProfile(type,company_id,id);
    // console.log("result tai controller", result);
    if (!result) {
      return next(new ApiError("Xóa hồ sơ thất bại", 404));
    }
    
    return res.success({ }, "Xóa hồ sơ thành công");
  } catch (err) {
    return next(new ApiError("Lỗi khi xóa hồ sơ công ty", 500));
  }
};

const updateLogoImage = async (req, res, next) => {
  try {
    const company_id= req.user.id;
    const logoFile = req.file;
    
    if (!company_id) {
      return next(new ApiError("Thiếu ID công ty", 400));
    }
    
    if (!logoFile) {
      return next(new ApiError("Không có file ảnh được tải lên", 400));
    }
        
    // Upload ảnh lên S3
    const logoUrl = await uploadImgToS3_employer(logoFile, company_id);

    if (!logoUrl) {
      return next(new ApiError("Lỗi khi tải ảnh lên", 500));
    }
    
    // Cập nhật URL logo trong database
    const result = await queryUpdateLogoImage(company_id, logoUrl);
    
    if (!result) {
      return next(new ApiError("Cập nhật logo thất bại", 500));
    }
    
    return res.success({ logo_url: logoUrl }, "Cập nhật logo thành công");
  } catch (err) {
    return next(new ApiError("Lỗi khi cập nhật logo công ty", 500));
  }
};

const updateBackgroundImage = async (req, res, next) => {
  try {
    const company_id= req.user.id;
    const bgFile = req.file;
    
    if (!company_id) {
      return next(new ApiError("Thiếu ID công ty", 400));
    }
    
    if (!bgFile) {
      return next(new ApiError("Không có file ảnh được tải lên", 400));
    }
    
   
    // Upload ảnh lên S3
    const bgUrl = await uploadImgToS3_employer(bgFile, company_id);

    if (!bgUrl) {
      return next(new ApiError("Lỗi khi tải ảnh lên", 500));
    }
    
    // Cập nhật URL ảnh bìa trong database
    const result = await queryUpdateBackgroundImage(company_id, bgUrl);
    
    if (!result) {
      return next(new ApiError("Cập nhật ảnh bìa thất bại", 500));
    }
    
    return res.success({ background_url: bgUrl }, "Cập nhật ảnh bìa thành công");
  } catch (err) {
    return next(new ApiError("Lỗi khi cập nhật ảnh bìa công ty", 500));
  }
};

const getListCandidate = async (req, res, next) => {
  try {
    const employer_id= req.user.id;
    
    if (!employer_id) {
      return next(new ApiError("Thiếu ID công ty", 400));
    }
       
    const data = await queryGetListCandidateSaving(employer_id);
    
    return res.success(
   data || [] ,
      "Lấy danh sách lưu ứng viên thành công"
    );
  } catch (err) {
    return next(new ApiError("Lỗi khi lấy danh sách lưu ứng viên", 500));
  }
};

const saveCandidate = async (req, res, next) => {
  try {
    const employer_id= req.user.id;
    const { jobseeker_id } = req.body;
    
    if (!employer_id || !jobseeker_id) {
      return next(new ApiError("Thiếu thông tin công ty hoặc ứng viên", 400));
    }
       
    const result = await querySaveCandidate(employer_id, jobseeker_id);
    
    if (!result) {
      return next(new ApiError("Lưu ứng viên thất bại", 500));
    }
    
    return res.success({ }, "Lưu ứng viên thành công");
  } catch (err) {
    return next(new ApiError("Lỗi khi lưu thông tin ứng viên", 500));
  }
};

const rateCandidate = async (req, res, next) => {
  try {
    const employer_id= req.user.id;
    const {type, application_id, rating, content } = req.body;
    
    if (!application_id || !employer_id || rating === undefined || !type) {
      return next(new ApiError("Thiếu thông tin đánh giá", 400));
    }
        
    const result = await queryRateCandidate(type, application_id, employer_id, rating, content);
    
    if (!result) {
      return next(new ApiError("Đánh giá ứng viên thất bại", 500));
    }
    
    return res.success({ }, "Đánh giá ứng viên thành công");
  } catch (err) {
    return next(new ApiError("Lỗi khi đánh giá ứng viên", 500));
  }
};

const deleteCandidate = async (req, res, next) => {
  try {
    const employer_id= req.user.id;
    const { jobseeker_id } = req.body;
    
    if (!employer_id || !jobseeker_id) {
      return next(new ApiError("Thiếu thông tin công ty hoặc ứng viên", 400));
    }
    
    const result = await queryDeleteCandidate(employer_id, jobseeker_id);
    
    if (!result) {
      return next(new ApiError("Xóa ứng viên đã lưu thất bại", 404));
    }
    
    return res.success({}, "Xóa ứng viên đã lưu thành công");
  } catch (err) {
    return next(new ApiError("Lỗi khi xóa ứng viên đã lưu", 500));
  }
};

const getListJobApplication = async (req, res, next) => {
  try {
    const employer_id= req.user.id;
    
    if (!employer_id) {
      return next(new ApiError("Thiếu ID công ty", 400));
    }
    
    const data = await queryGetListJobApplication(employer_id);
    
    return res.success(
       data || [],
      "Lấy danh sách đơn ứng tuyển thành công"
    );
  } catch (err) {
    return next(new ApiError("Lỗi khi lấy danh sách đơn ứng tuyển", 500));
  }
};

const rejectJobApplication = async (req, res, next) => {
  try {
    const employer_id= req.user.id;
    const { job_id,jobseeker_id} = req.body;
    
    if (!jobseeker_id || !employer_id) {
      return next(new ApiError("Thiếu thông tin đơn ứng tuyển hoặc công ty", 400));
    }
 
    const result = await queryRejectJobApplication(employer_id,job_id,jobseeker_id);
    
    if (!result) {
      return next(new ApiError("Từ chối đơn ứng tuyển thất bại", 500));
    }
    
    return res.success({ },"Từ chối đơn ứng tuyển thành công");
  } catch (err) {
    return next(new ApiError("Lỗi khi từ chối đơn ứng tuyển", 500));
  }
};



const inviteCandidateApply = async (req, res, next) => {
  try {
    const employer_id= req.user.id;
    const { jobseeker_id, job_ids } = req.body;
    
    if (!employer_id || !jobseeker_id || !job_ids) {
      return next(new ApiError("Thiếu thông tin công ty hoặc ứng viên hoặc job_id", 400));
    }
   
    const result = await queryInviteJobseekerApply(employer_id, jobseeker_id, job_ids);
    
    if (!result) {
      return next(new ApiError("Lưu ứng viên thất bại", 500));
    }
    
    return res.success({ }, "Lưu ứng viên thành công");
  } catch (err) {
    return next(new ApiError("Lỗi khi lưu thông tin ứng viên", 500));
  }
};

const deleteInvitation = async (req, res, next) => {
  try{
    const employer_id= req.user.id;
    const { jobseeker_id, job_id } = req.body;
    
    if (!employer_id || !jobseeker_id || !job_id) {
      return next(new ApiError("Thiếu thông tin công ty hoặc ứng viên hoặc job_id", 400));
    }
        
    const result = await queryDeleteInvitation(employer_id, jobseeker_id, job_id);
    
    if (!result) {
      return next(new ApiError("Xóa lời mời thất bại", 500));
    }    
    return res.success({ }, "Xóa lời mời thành công");
  }
  catch (err) {
    return next(new ApiError("Lỗi khi xóa lời mời ứng tuyển", 500));
  } 

};


const getOverview = async (req, res, next) => {
  try {
    const employer_id= req.user.id;
    const { days } = req.body;
    
    if (!employer_id || !days) {
      return next(new ApiError("Thiếu ID công ty/ ngày thống kê", 400));
    }
    
    const data = await queryGetOverview(employer_id, days);
    
    return res.success(
        data || [] ,
      "Lấy thông tin tổng quan thành công"
    );
  } catch (err) {
    return next(new ApiError("Lỗi khi lấy thông tin tổng quan", 500));
  }
};

const getListJobForInvite = async (req, res, next) => {
  try {
    const employer_id= req.user.id;
    const { jobseeker_id } = req.query;
    
    if (!employer_id, !jobseeker_id) {
      return next(new ApiError("Thiếu ID công ty/ ứng viên", 400));
    }
   
    const data = await queryGetListJobForInvite(employer_id, jobseeker_id);
    
    return res.success(
       data || [] ,
      "Lấy danh sách việc làm thành công"
    );
  } catch (err) {
    return next(new ApiError("Lỗi khi lấy danh sách việc làm", 500));
  }
};


const getListInvitaion = async (req, res, next) => {
  try {
    const employer_id= req.user.id;
    if (!employer_id) {
      return next(new ApiError("Thiếu ID công ty", 400));
    }
    
    const data = await queryGetListInvitaion(employer_id);
    
    return res.success(
       data || [] ,
      "Lấy danh sách lời mời ứng tuyển thành công"
    );
  } catch (err) {
    return next(new ApiError("Lỗi khi lấy danh sách lời mời ứng tuyển", 500));
  }
}


const getNotification = async (req, res, next) => {
  try {
    const employer_id= req.user.id;
    
    if (!employer_id) {
      return next(new ApiError("Thiếu ID công ty", 400));
    }
    
    const data = await queryGetNotification(employer_id);
    
    return res.success(
       data || [] ,
      "Lấy danh sách thông báo thành công"
    );
  } catch (err) {
    return next(new ApiError("Lỗi khi lấy danh sách thông báo", 500));
  }
}

const updateReadNotification = async (req, res, next) => {
  try {
    const employer_id= req.user.id;
    const { notification_id } = req.body;
    
    if (!employer_id || !notification_id) {
      return next(new ApiError("Thiếu ID công ty/ thông báo", 400));
    }
    
    const result = await queryUpdateReadNotification(employer_id, notification_id);
    
    if (!result) {
      return next(new ApiError("Cập nhật thông báo thất bại", 500));
    }    
    return res.success({ }, "Cập nhật thông báo thành công");
  } catch (err) {
    return next(new ApiError("Lỗi khi cập nhật thông báo", 500));
  } 
}

const changePassword = async (req, res, next) => {
  try {
    const employer_id= req.user.id;
    const { newPassword } = req.body;

    if (!employer_id || !newPassword) {
      return next(new ApiError("Thiếu thông tin công ty/ mật khẩu", 400));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await queryChangePassword(employer_id, hashedPassword);
    if (!result) {
      return next(new ApiError("Cập nhật mật khẩu thất bại", 500));
    }
    return res.success({ }, "Cập nhật mật khẩu thành công");
  } catch (err) {
    return next(new ApiError("Lỗi khi cập nhật mật khẩu", 500));
  } 
}

module.exports = {
  getListJobseekerBySearch,
  getListJobByUser,
  getJobDetailByUser,

  getJobseekerDetail,
  getJobseekerCV,

  addJobByUser,
  updateJobByUser,
  deleteJobByUser,

  getCompanyInformation,
  addItemCompanyProfile,
  updateItemCompanyProfile,
  deleteItemCompanyProfile,
  updateLogoImage,
  updateBackgroundImage,

  getListCandidate,
  saveCandidate,
  rateCandidate,
  deleteCandidate,

  getListJobApplication,
  rejectJobApplication,

  getListJobForInvite,
  getListInvitaion,
  deleteInvitation,
  inviteCandidateApply,

  getOverview,


  getNotification,
  updateReadNotification,
  changePassword,
};