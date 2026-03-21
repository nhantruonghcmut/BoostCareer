import express from "express";
import {
  getPublicInformationOfCompany,
  getPublicJobDetail,
  getListJobBySearch,
  getListJobOfCompany,
  getListLeadingCompany,
  getListCompanyBySearch,
  getGeneralInfo,
  getRelatedJobs

} from "../controllers/guestControllers.js";

const guestRoutes = express.Router();
guestRoutes.get("/job-detail", getPublicJobDetail);
guestRoutes.get("/jobs", getListJobBySearch);
guestRoutes.get("/jobs-of-company", getListJobOfCompany);
guestRoutes.get("/leading-company", getListLeadingCompany);
guestRoutes.get("/companies", getListCompanyBySearch);
guestRoutes.get("/company-detail", getPublicInformationOfCompany);
guestRoutes.get("/general-info", getGeneralInfo);
guestRoutes.get("/related-jobs", getRelatedJobs);
export default guestRoutes;








