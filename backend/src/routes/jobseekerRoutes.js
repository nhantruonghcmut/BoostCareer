import express from "express";
import {
  jobseekerGetJobDetail,
  getOverview,
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
  getCompanyReview,
  updateCompanyReview,
  getListCompanyFollowing,
  deleteCompanyFollowing,
  addCompanyFollowing,
  getListJobSaving,
  addJobSaving,
  recalculateProfileCompletion,
  deleteJobSaving,
  getJobsSuggestion,
  getNotification,
  updateReadNotification,
  changePassword,
} from "../controllers/jobseekerControllers.js";

import { upload } from "../middlewares/imageUpload.js";
import { verifyToken, verifyRole } from '../middlewares/authMiddleware.js';
const jobseekerRoutes = express.Router();

// Bảo vệ routes với token và role
jobseekerRoutes.use(verifyToken);
jobseekerRoutes.use(verifyRole(3)); // Role 3 là jobseeker

jobseekerRoutes.get("/profile", getItemProfile);
jobseekerRoutes.post("/profile", addItemProfile);
jobseekerRoutes.put("/profile", updateItemProfile);
jobseekerRoutes.delete("/profile", deleteItemProfile);
jobseekerRoutes.post(
  "/avatar-imagine",
  upload.single("image"),
  updateJobseekerProfileImage
);
jobseekerRoutes.post("/profile-cv", upload.single("resume"), addResume);
jobseekerRoutes.get("/profile-cv", getResume);
jobseekerRoutes.delete("/profile-cv", deleteResume);
jobseekerRoutes.post("/show-hide-profile-cv", showHideResume);

jobseekerRoutes.post("/job", jobseekerGetJobDetail);
jobseekerRoutes.get("/job-applications", getListJobApplication); // lấy
jobseekerRoutes.post("/job-application", applyToJob);

jobseekerRoutes.post("/company-rating", addCompanyReview); // đánh giá công ty
jobseekerRoutes.get("/company-rating", getCompanyReview); // lấy danh sách đánh giá công ty
jobseekerRoutes.put("/company-rating", updateCompanyReview); // cập nhật đánh giá công ty



jobseekerRoutes.get("/company-following", getListCompanyFollowing); // lấy danh sách công ty đã theo dõi
jobseekerRoutes.delete("/company-following", deleteCompanyFollowing); // bỏ theo dõi công ty
jobseekerRoutes.post("/company-following", addCompanyFollowing); // theo dõi công ty

jobseekerRoutes.get("/job-saving", getListJobSaving); // lấy danh sách việc làm đã lưu
jobseekerRoutes.post("/job-saving", addJobSaving); // thêm việc làm vào danh sách đã lưu
jobseekerRoutes.delete("/job-saving", deleteJobSaving); // xóa việc làm đã lưu

jobseekerRoutes.post("/overview", getOverview); // xóa việc làm đã lưu
jobseekerRoutes.get("/jobs-suggestion", getJobsSuggestion); // xóa việc làm đã lưu

jobseekerRoutes.get("/jobs-suggestion", getJobsSuggestion); // xóa việc làm đã lưu


jobseekerRoutes.get("/notification", getNotification); // lấy danh sách thông báo
jobseekerRoutes.put("/notification", updateReadNotification); // dùng để đánh dấu đã đọc thông báo

jobseekerRoutes.post("/change-password", changePassword); // đổi mật khẩu

jobseekerRoutes.get("/profile-completion", recalculateProfileCompletion); // tính lại tỉ lệ hoàn thành hồ sơ


export default jobseekerRoutes;






