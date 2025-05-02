const express = require("express");

const {
  // getWorkDetail,
  getWorkBySearch,
  deletejobs,
  update_status_,
  getAllJob
} = require("../controllers/Control_job.js");

const Routes_job = express.Router();

Routes_job.get("/get_all_job", getAllJob);
Routes_job.post("/search", getWorkBySearch);
Routes_job.delete("/deletejob/:job_id", deletejobs);
Routes_job.delete("/deletejobs", deletejobs);
Routes_job.post("/update_status_", update_status_);

module.exports = Routes_job;

