const { uploadToS3, uploadToS3CV, deleteFileFromS3 } = require("../middlewares/imageUpload.js");

const ApiError = require('../utils/ApiError');
const {
  queryJobseekerGetJobDetail,
  queryGetItemProfile,
  queryDeleteItemProfile,
  queryAddItemProfile,
  queryUpdateItemProfile,
  queryUpdateJobseekerProfileImage,
  queryAddResume,
  queryGetResume,
  queryDeleteResume,
  queryShowHideResume,
  queryGetListJobApplication,
  queryApplyToJob,
  queryAddCompanyReview,
  queryGetListCompanyFollowing,
  queryDeleteCompanyFollowing,
  queryAddCompanyFollowing,
  queryGetListJobSaving,
  queryAddJobSaving,
  queryDeleteJobSaving,
  queryGetOverview,
  queryGetJobsSuggestion,
  queryGetNotification,
  queryUpdateReadNotification
} = require("../models/jobseekerModels.js");

const jobseekerGetJobDetail = async (req, res, next) => {
  try {
    const profile_id = req.user.id;
    const {  job_id } = req.query;
    
    if (!job_id || !profile_id) {
      return next(new ApiError("Thiếu thông tin công việc hoặc ID hồ sơ", 400));
    }
    
    const jobdetail = await queryJobseekerGetJobDetail(profile_id, job_id);
    if (!jobdetail) {
      return next(new ApiError("Không tìm thấy công việc", 404));
    }
    return res.success(
      jobdetail, 
      `Lấy thông tin công việc ${job_id} thành công`
    );
  } catch (err) {
    return next(new ApiError(`Có lỗi khi lấy thông tin công việc: ${err.message}`, 500));
  }
};



const updateJobseekerProfileImage = async (req, res, next) => {
  try {
    const id = req.user.id;
    
    if (!id) {
      return next(new ApiError("Thiếu thông tin ID người dùng", 400));
    }
    
    if (!req.file) {
      return next(new ApiError("Không có file ảnh được tải lên", 400));
    }

    try {
      const imageUrl = await uploadToS3(req.file);
      const affectedRows = await queryUpdateJobseekerProfileImage(id, imageUrl);
      
      if (affectedRows === 0) {
        return next(new ApiError("Cập nhật ảnh đại diện không thành công", 400));
      }
      return res.success({}, "Cập nhật ảnh đại diện thành công");
    } catch (uploadErr) {
      return next(new ApiError(`Lỗi khi tải lên ảnh: ${uploadErr.message}`, 500));
    }
  } catch (err) {
    return next(new ApiError("Lỗi server khi cập nhật ảnh", 500));
  }
};

/**
 * Lấy thông tin hồ sơ theo loại
 */
const getItemProfile = async (req, res, next) => {
  try {
    const profile_id = req.user.id;
    const { type } = req.query;
    
    if (!type || !profile_id) {
      return next(new ApiError("Thiếu thông tin loại hồ sơ hoặc ID hồ sơ", 400));
    }
    
    const userInfor = await queryGetItemProfile(type, profile_id);
    return res.success(
      userInfor || [], 
      `Lấy thông tin hồ sơ ${type} thành công`
    );
  } catch (err) {
    return next(new ApiError(`Có lỗi khi lấy thông tin hồ sơ: ${err.message}`, 500));
  }
};

/**
 * Cập nhật thông tin hồ sơ
 */
const updateItemProfile = async (req, res, next) => {
  try {
    const profile_id = req.user.id;
    const { type, data } = req.body;
    // console.log("updateItemProfile", type, data);
    if (!type || !data) {
      return next(new ApiError("Thiếu thông tin cần thiết", 400));
    }
    
    // if (!data.profile_id) {
    //   return next(new ApiError("Thiếu thông tin ID hồ sơ", 400));
    // }
    
    data.create_at = new Date();
    
    const result = await queryUpdateItemProfile(type, {...data,profile_id});
    
    if (!result) {
      return next(new ApiError("Cập nhật hồ sơ không thành công", 400));
    }    
    return res.success({}, "Cập nhật hồ sơ thành công");
  } catch (err) {
    return next(new ApiError(`Lỗi khi cập nhật hồ sơ: ${err.message}`, 500));
  }
};

/**
 * Xóa thông tin hồ sơ
 */
const deleteItemProfile = async (req, res, next) => {
  try {
    const profile_id = req.user.id;
    const { type, data } = req.body;
    
    if (!type || !data) {
      return next(new ApiError("Thiếu thông tin cần thiết", 400));
    }
    
    if (!profile_id) {
      return next(new ApiError("Thiếu thông tin ID hồ sơ", 400));
    }
    
    const success = await queryDeleteItemProfile(type, {...data,profile_id});
    
    if (success) {
      return res.success({}, "Xóa thông tin hồ sơ thành công");
    }    
      return next(new ApiError("Xóa thông tin hồ sơ không thành công", 400)); 
  } catch (err) {
    return next(new ApiError(`Lỗi khi xóa thông tin hồ sơ: ${err.message}`, 500));
  }
};

/**
 * Thêm thông tin hồ sơ
 */
const addItemProfile = async (req, res, next) => {
  try {
    const profile_id = req.user.id;
    const { type, data } = req.body;
    
    if (!type || !data) {
      return next(new ApiError("Thiếu thông tin cần thiết", 400));
    }
    
    if (!profile_id) {
      return next(new ApiError("Thiếu thông tin ID hồ sơ", 400));
    }
    
    data.create_at = new Date();
    
    const affectedRows = await queryAddItemProfile(type, {...data,profile_id});
    
    if (affectedRows === 0) {
      return next(new ApiError("Thêm thông tin hồ sơ không thành công", 400));
    }

    return res.success({}, "Thêm thông tin hồ sơ thành công");
  } catch (err) {
    return next(new ApiError(`Lỗi khi thêm thông tin hồ sơ: ${err.message}`, 500));
  }
};

/**
 * Lấy thông tin thông báo theo ID
 */

////////////////////////////////////////////////////////////

// Upload a new resume
const addResume = async (req, res, next) => {
  try {
    const profile_id = req.user.id;
    
    if (!profile_id) {
      return next(new ApiError("Missing user profile ID", 400));
    }
    
    if (!req.file) {
      return next(new ApiError("No file uploaded", 400));
    }

    // Check file type
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    
    if (!allowedExtensions.includes(fileExtension)) {
      return next(new ApiError("Only PDF and DOC files are allowed", 400));
    }

    try {
      // Pass the profile_id to the upload function
      const fileInfo = await uploadToS3CV(req.file, profile_id);
      
      // Save resume data to database
      const resumeData = {
        cv_name: req.file.originalname,
        cv_link: fileInfo.url,
        s3_key: fileInfo.key // Store the S3 key for easier deletion
      };
      
      const cvId = await queryAddResume(profile_id, resumeData);
      
      if (!cvId) {
        return next(new ApiError("Failed to save resume data", 500));
      }
      // Get updated list of user's resumes
      const resumes = await queryGetResume(profile_id);
      
      return res.success(
        { resumes }, 
        "Resume uploaded successfully"
      );
    } catch (uploadErr) {
      return next(new ApiError(`Error uploading resume: ${uploadErr.message}`, 500));
    }
  } catch (err) {
    return next(new ApiError(`Server error: ${err.message}`, 500));
  }
};

// Get all resumes for a user
const getResume = async (req, res, next) => {
  try {
    const profile_id = req.user.id;
    
    if (!profile_id) {
      return next(new ApiError("Missing user profile ID", 400));
    }
    
    const resumes = await queryGetResume(profile_id);
    
    return res.success(
      { resumes: resumes || [] }, 
      "Resumes retrieved successfully"
    );
  } catch (err) {
    return next(new ApiError(`Error retrieving resumes: ${err.message}`, 500));
  }
};

// Delete a resume
const deleteResume = async (req, res, next) => {
  try {
    const profile_id = req.user.id;
    const { cv_id } = req.body;
    
    // First get the resume to retrieve the S3 key
    const [resume] = await db.query(
      `SELECT s3_key FROM profile_cv WHERE cv_id = ? AND profile_id = ?`,
      [cv_id, profile_id]
    );
    
    if (!resume || resume.length === 0) {
      return next(new ApiError("Resume not found", 404));
    }
    
    // Delete from S3 using the stored key
    try {
      await deleteFileFromS3(resume[0].s3_key);
    } catch (s3Error) {
      console.error("Error deleting file from S3:", s3Error);
      // Continue with database deletion even if S3 deletion fails
    }
    
    const deleted = await queryDeleteResume(profile_id,cv_id);
    
    if (!deleted) {
      return next(new ApiError("Resume not found or you don't have permission to delete it", 404));
    }
    
    // Get updated list after deletion
    const resumes = await queryGetResume(profile_id);
    
    return res.success(
      { resumes }, 
      "Resume deleted successfully"
    );
  } catch (err) {
    return next(new ApiError(`Error deleting resume: ${err.message}`, 500));
  }
};

const getListJobApplication = async (req, res, next) => {
  console.log("getListJobApplication");
  try {
    const profile_id = req.user.id;
  // const profile_id = req.query.profile_id;
  // console.log("getListJobApplication", profile_id);
  if (!profile_id) {
    return next(new ApiError("Thiếu thông tin ID người dùng", 400));
  }
  const data = await queryGetListJobApplication(profile_id);
  if (!data) {
    return next(new ApiError("Không tìm thấy danh sách công việc đã ứng tuyển", 404));
  }
  return res.success(
    { jobs: data || [] },
    "Lấy danh sách công việc đã ứng tuyển thành công"
  );
}
  catch (err) {
    return next(new ApiError("Lỗi khi tìm kiếm bài đăng", 500));
  }
};

const applyToJob = async (req, res, next) => {
  try {
    const profile_id = req.user.id;
  const {job_id} = req.body;
  console.log("Apply job", profile_id, job_id);
  if (!job_id || !profile_id) {
    return next(new ApiError("Thiếu thông tin ID bài đăng hoặc ID người dùng", 400));
  }
  const success = await queryApplyToJob(profile_id,job_id);
  if (success) {
    return res.success({}, "Ứng tuyển thành công");
  }
  return next(new ApiError("Ứng tuyển không thành công", 400));
}
  catch (err) {
    return next(new ApiError("Lỗi khi ứng tuyển công việc", 500));
  }
};

const addCompanyReview = async (req, res, next) => {
  try {
    const profile_id = req.user.id;
    const { company_id, score,content } = req.body;
  if (!company_id || !profile_id || !score) {
    return next(new ApiError("Thiếu thông tin ID công ty hoặc ID người dùng", 400));
  }
  const success = await queryAddCompanyReview( profile_id,company_id, score,content);
  if (success) {
    return res.success({}, "Đánh giá công ty thành công");    
  }
  return next(new ApiError("Đánh giá công ty không thành công", 400));
}
  catch (err) {
    return next(new ApiError("Lỗi khi đánh giá công ty", 500));
  }
};

const getListCompanyFollowing = async (req, res, next) => {
  try {  
    const profile_id = req.user.id;
  if (!profile_id) {
    return next(new ApiError("Thiếu thông tin ID người dùng", 400));
  }
  const data = await queryGetListCompanyFollowing(profile_id);
  // console.log("getListCompanyFollowing", data);
  if (!data) {
    return next(new ApiError("Không tìm thấy thông tin công ty đã theo dõi", 404));
  }
  return res.success(
    data,
    "Lấy danh sách công ty đã theo dõi thành công"
  );
}
  catch (err) {
    return next(new ApiError("Lỗi khi tìm kiếm công ty đã theo dõi", 500));
  }
};

const deleteCompanyFollowing = async (req, res, next) => {
  try {
    const profile_id = req.user.id;
  const {company_id} = req.body;
  if (!company_id || !profile_id) {
    return next(new ApiError("Thiếu thông tin ID công ty hoặc ID người dùng", 400));
  }
  const success = await queryDeleteCompanyFollowing( profile_id,company_id);
  if (success) {
    return res.success({}, "Bỏ theo dõi công ty thành công");
  }
    return next(new ApiError("Bỏ theo dõi công ty không thành công", 400));
}
  catch (err) {
    return next(new ApiError("Lỗi khi bỏ theo dõi công ty", 500));
  }
};

const addCompanyFollowing = async (req, res, next) => {
  try {
    const profile_id = req.user.id;
  const {company_id} = req.body;
  if (!company_id || !profile_id) {
    return next(new ApiError("Thiếu thông tin ID công ty hoặc ID người dùng", 400));
  }
  const success = await queryAddCompanyFollowing(profile_id,company_id);
  if (success) {
  return res.success({}, "Theo dõi công ty thành công");
}
    return next(new ApiError("Theo dõi công ty không thành công", 400));  
}
  catch (err) {
    return next(new ApiError("Lỗi khi thêm công ty theo dõi", 500));
  }
};

const getListJobSaving = async (req, res, next) => {
  try {
    const profile_id = req.user.id;
  if (!profile_id) {
    return next(new ApiError("Thiếu thông tin ID người dùng", 400));
  }
  const data = await queryGetListJobSaving(profile_id);
  if (!data) {
    return next(new ApiError("Không tìm thấy thông tin bài đăng đã lưu", 404));
  }
  return res.success(
    { jobs: data || [] },
    "Lấy danh sách bài đăng đã lưu thành công"
  );
}
  catch (err) {
    return next(new ApiError("Lỗi khi tìm kiếm bài đăng đã lưu", 500));
  }
};

const addJobSaving = async (req, res, next) => {
  try {
    const profile_id = req.user.id;
  const {job_id} = req.body;

  if (!job_id || !profile_id) {
    return next(new ApiError("Thiếu thông tin ID bài đăng hoặc ID người dùng", 400));
  }
  const success = await queryAddJobSaving(profile_id,job_id);
  if (success) {  
    return res.success({}, "Lưu bản tin công việc thành công");
  }  
  return next(new ApiError("Lưu bản tin không thành công", 400));

}
  catch (err) {
    return next(new ApiError("Lỗi khi lưu bản tin", 500));
  }
};

const deleteJobSaving = async (req, res, next) => {
  try {
    const profile_id = req.user.id;
  const {job_id} = req.body;
  if (!job_id || !profile_id) {
    return next(new ApiError("Thiếu thông tin ID bài đăng hoặc ID người dùng", 400));
  }
  const success = await queryDeleteJobSaving(profile_id,job_id);
  if (success) { 
    return res.success({}, "Xóa lưu bản tin thành công");
  }
  return next(new ApiError("Xóa lưu bản tin không thành công", 400));
}
  catch (err) {
    return next(new ApiError("Lỗi khi xóa lưu bản tin", 500));
  }
};


const getOverview = async (req, res, next) => {
  try {
    const profile_id = req.user.id;
    const { days} = req.body;
    
    if (!profile_id || !days) {
      return next(new ApiError("Thiếu thông tin", 400));
    }
    
    const data = await queryGetOverview(profile_id, days);
    
    if (!data) {
      return next(new ApiError("Không tìm thấy thông tin tổng quan", 404));
    }
    
    return res.success(
       data || [] ,
      "Lấy thông tin tổng quan thành công"
    );
  } catch (err) {
    return next(new ApiError("Lỗi khi tìm kiếm thông tin tổng quan", 500));
  }
};


const getJobsSuggestion = async (req, res, next) => {
  try {
    const profile_id = req.user.id;
    
    if (!profile_id) {
      return next(new ApiError("Thiếu thông tin ID người dùng", 400));
    }
    const data = await queryGetJobsSuggestion(profile_id);
    if (!data) {
      return next(new ApiError("Không tìm thấy thông tin công việc gợi ý", 404));
    }
    return res.success(
      { jobs: data || [] },
      "Lấy danh sách công việc gợi ý thành công"
    );
  } catch (err) {
    return next(new ApiError("Lỗi khi tìm kiếm công việc gợi ý", 500));
  }
};

const getNotification = async (req, res, next) => {
  try {
    const profile_id = req.user.id;
    
    if (!profile_id) {
      return next(new ApiError("Thiếu ID công ty", 400));
    }    
     
    const data = await queryGetNotification(profile_id);
    
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
    const profile_id = req.user.id;
    const { notification_id } = req.body;
    
    if (!profile_id || !notification_id) {
      return next(new ApiError("Thiếu ID công ty/ thông báo", 400));
    }    
      
    const result = await queryUpdateReadNotification(profile_id, notification_id);
    
    if (!result) {
      return next(new ApiError("Cập nhật thông báo thất bại", 500));
    }    
    return res.success({ }, "Cập nhật thông báo thành công");
  } catch (err) {
    return next(new ApiError("Lỗi khi cập nhật thông báo", 500));
  } 

}


const showHideResume = async (req, res, next) => {
  try {
  const { profile_id, cv_id, type } = req.body;
  if (!type || !profile_id || !cv_id) {
    return next(new ApiError("Thiếu thông tin cần thiết", 400));
  }

  if (!profile_id) {
    return next(new ApiError("Thiếu thông tin ID hồ sơ", 400));
  }

  const result = await queryShowHideResume(profile_id, cv_id, type);
  if (!result) {
    return next(new ApiError("Show/Hide CV thất bại", 500));
  }
  return res.success({}, "Show/Hide CV thành công");
} catch (err) {
  return next(new ApiError("Lỗi khi cShow/Hide CV", 500));
}
};
module.exports = {
  jobseekerGetJobDetail,
  getItemProfile,
  deleteItemProfile,
  addItemProfile,
  updateItemProfile,
  updateJobseekerProfileImage,
  addResume,
  getResume,
  deleteResume,
  showHideResume,

  getListJobApplication,
  applyToJob,

  addCompanyReview,
  

  getListCompanyFollowing,
  deleteCompanyFollowing,
  addCompanyFollowing,

  getListJobSaving,
  addJobSaving,
  deleteJobSaving,

  getOverview,
  getJobsSuggestion,


  getNotification,
  updateReadNotification
};