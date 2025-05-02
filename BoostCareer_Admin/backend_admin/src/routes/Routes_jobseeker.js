const express = require("express");

const {
  // create_new_user,
  get_UserInformation,
  get_All_jobseeker,   
  get_jobseeker_bysearch,
  delete_jobseeker_byid,
  update_Status_,
  send_Message,
  reset_Password, 
} = require("../controllers/Control_jobseeler.js");

const Routes_jobseeker = express.Router();
// action
// Routes_user.post("/create_new_jobseeker", create_new_user);
Routes_jobseeker.get("/get_all_jobseeker", get_All_jobseeker);
Routes_jobseeker.post("/get_jobseeker", get_UserInformation);
Routes_jobseeker.post("/search_jobseeker", get_jobseeker_bysearch);
Routes_jobseeker.delete("/delete_jobseekers", delete_jobseeker_byid);
Routes_jobseeker.post("/update_status_", update_Status_);
Routes_jobseeker.post('/reset_password', reset_Password);
Routes_jobseeker.post('send_message', send_Message);

module.exports = Routes_jobseeker;
