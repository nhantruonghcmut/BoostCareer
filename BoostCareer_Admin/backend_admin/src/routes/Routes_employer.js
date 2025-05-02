const express = require("express");

const {
  get_All_employer,
  get_Employer_bysearch,
  delete_Employers,
  update_Status_,
  send_Message,
  reset_Password,
} = require("../controllers/Control_employer.js");

const Routes_employer = express.Router();

Routes_employer.get("/get_all_employer", get_All_employer);
Routes_employer.post("/search_employer", get_Employer_bysearch);
Routes_employer.delete("/delete_employers", delete_Employers);
Routes_employer.post("/update_status_", update_Status_);
Routes_employer.post("/send_message", send_Message);
Routes_employer.post("/reset_password", reset_Password);

module.exports = Routes_employer;
