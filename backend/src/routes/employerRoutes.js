const express = require("express");

const {
  getListJobseekerBySearch,
  getJobseekerDetail,
  getListJobByUser,
  getJobDetailByUser,
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
  inviteCandidateApply,
  getOverview,
  getListJobForInvite,
  getListInvitaion,
  deleteInvitation,
  getNotification,
  updateReadNotification
} = require("../controllers/employerControllers.js");
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');
const { upload } = require("../middlewares/imageUpload.js");

const employerRoutes = express.Router();
employerRoutes.use(verifyToken);
employerRoutes.use(verifyRole(2)); // Role 2 là employer
employerRoutes.get("/jobseekers", getListJobseekerBySearch);   // lấy danh sách
employerRoutes.get("/jobseeker-detail", getJobseekerDetail); // lấy thông tin chi tiết ứng viên 
// employerRoutes.get("/jobseeker-cv", getJobseekerCV); // tải CV ứng viên
employerRoutes.get("/jobs", getListJobByUser); // lấy danh sách tin tuyển dụng của công ty
employerRoutes.get("/job-detail", getJobDetailByUser); // lấy chi tiết tin tuyển dụng
employerRoutes.post("/job", addJobByUser); // đăng tin tuyển dụng mới
employerRoutes.put("/job", updateJobByUser); // chỉnh sửa tin tuyển dụng
employerRoutes.delete("/job", deleteJobByUser); // xóa tin tuyển dụng

employerRoutes.get("/profile", getCompanyInformation);
employerRoutes.post("/profile", addItemCompanyProfile);
employerRoutes.put("/profile", updateItemCompanyProfile);
employerRoutes.delete("/profile", deleteItemCompanyProfile);
employerRoutes.put("/logo-image",upload.single("image"), updateLogoImage);
employerRoutes.put("/background-image",upload.single("image"), updateBackgroundImage);

employerRoutes.get("/candidates", getListCandidate);  // lấy danh sách ứng viên được lưu lại
employerRoutes.post("/candidate", saveCandidate); // thêm ứng viên vào danh sách ứng viên đã lưu
employerRoutes.put("/candidate", rateCandidate);   // cập nhật rating cho ứng viên
employerRoutes.delete("/candidate", deleteCandidate); // xóa ứng viên khỏi danh sách ứng viên đã lưu

employerRoutes.get("/job-applications", getListJobApplication );  // lấy danh sách ứng viên đã ứng tuyển
employerRoutes.delete("/job-application", rejectJobApplication); // dùng để reject ứng viên

employerRoutes.get("/list-job-for-invitation", getListJobForInvite); 
employerRoutes.get("/invitation", getListInvitaion); // lấy danh sách ứng viên đã MỜI ứng tuyển
employerRoutes.post("/job-invitation", inviteCandidateApply); 
employerRoutes.delete("/job-invitation", deleteInvitation); // xóa lời mời ứng tuyển của ứng viên

employerRoutes.post("/overview", getOverview); // lấy thông tin tổng quan của công ty); 

employerRoutes.get("/notification", getNotification); // lấy danh sách thông báo
employerRoutes.put("/notification", updateReadNotification); // dùng để đánh dấu đã đọc thông báo

module.exports = employerRoutes ;



