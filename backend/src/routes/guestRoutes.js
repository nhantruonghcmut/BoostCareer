const express = require("express");
const {
  getPublicInformationOfCompany,
  getPublicJobDetail,
  getListJobBySearch,
  getListJobOfCompany,
  getListLeadingCompany,
  getListCompanyBySearch,
  getGeneralInfo,
  getRelatedJobs

} = require("../controllers/guestControllers.js");

const guestRoutes = express.Router();
guestRoutes.get("/job-detail", getPublicJobDetail);
guestRoutes.get("/jobs", getListJobBySearch);
guestRoutes.get("/jobs-of-company", getListJobOfCompany);
guestRoutes.get("/leading-company", getListLeadingCompany);
guestRoutes.get("/companies", getListCompanyBySearch);
guestRoutes.get("/company-detail", getPublicInformationOfCompany);
guestRoutes.get("/general-info", getGeneralInfo);
guestRoutes.get("/related-jobs", getRelatedJobs);
module.exports = guestRoutes;








