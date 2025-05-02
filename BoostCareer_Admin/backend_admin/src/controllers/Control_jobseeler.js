const {  
  queryGet_UserInformation,    
  queryget_jobseeker_bysearch,
  querydelete_jobseeker_byid,
  queryupdate_Status_,
  querysend_Message,
  queryreset_Password, 
} = require("../models/Model_jobseeker.js");

const get_UserInformation = async (req, res) => {
  const id = req.query.id;
  try {
    const userInfor = await queryGet_UserInformation(id);
    if (userInfor) {
      return res.status(200).json({ userInfor });
    }
  } catch (err) {
    console.error("Có lỗi khi lấy thông tin user:", err);
    res.status(500).json({ message: "Có lỗi khi lấy thông tin user." });
  }
};

const get_All_jobseeker = async (req, res) => {
  try {
    const active_page = 1;
    const_paging_size = 10;
    const totalPages = 0;
    const paging = { active_page, paging_size,totalPages };
    console.log("dang get_All_jobseeker ", req.body);
    const jobseekers = await queryget_jobseeker_bysearch({}, paging);

    if (jobseekers) {
      return res.status(200).json({ jobseekers });
    }
  } catch (error) {
    console.log("Get Leading jobseeker error:", error);
    res.status(500);
  }
};

const get_jobseeker_bysearch = async (req, res) => {
  try {
    console.log("dang Search Jobseeker ", req.body);
    const { searchData, paging } = req.body;
    const paging_size = Number(paging.paging_size);    
    const jobseekers = await queryget_jobseeker_bysearch(searchData, paging);
    if (jobseekers) {
      const total_count = jobseekers.length > 0? jobseekers[0].total_count : 0;
      const totalPages = Math.ceil(total_count / paging_size);
      return res.status(200).json({ jobseekers, totalPages });
    }
    else
    {
      return res.status(200).json({jobs:[],totalPages:0 });
    }
    
  } catch (error) {
    console.log("Get Leading jobseeker error:", error);
    res.status(500);
  }
};

const delete_jobseeker_byid = async (req, res) => {
  try {
    const jobseeker_ids = req.body.jobseeker_ids;
    const jobseeker = await querydelete_jobseeker_byid(jobseeker_ids);
    if (jobseeker) {
      return res.status(200).json({ jobseeker });
    }
  } catch (error) {
    console.log("Get Leading jobseeker error:", error);
    res.status(500);
  }
};

const update_Status_ = async (req, res) => {
  try {
    const { status_, jobseeker_ids } = req.body;
    const jobseeker = await queryupdate_Status_(status_, jobseeker_ids);

    if (jobseeker) {
      return res.status(200).json({ jobseeker });
    }
  } catch (error) {
    console.log("Get Leading jobseeker error:", error);
    res.status(500);
  }
};

const send_Message = async (req, res) => {
  try {
    const jobseeker = await querysend_Message();

    if (jobseeker) {
      return res.status(200).json({ jobseeker });
    }
  } catch (error) {
    console.log("Get Leading jobseeker error:", error);
    res.status(500);
  }
};

const reset_Password = async (req, res) => {
  try {
    const jobseeker = await queryreset_Password();

    if (jobseeker) {
      return res.status(200).json({ jobseeker });
    }
  } catch (error) {
    console.log("Get Leading jobseeker error:", error);
    res.status(500);
  }
};

module.exports = { 
  get_UserInformation,
  get_All_jobseeker,   
  get_jobseeker_bysearch,
  delete_jobseeker_byid,
  update_Status_,
  send_Message,
  reset_Password, 
};



