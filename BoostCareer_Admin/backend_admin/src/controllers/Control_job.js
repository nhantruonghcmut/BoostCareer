const {
  queryGetWorkDetail,
  queryGetWorkBySearch,
  querydeletejobs,
  queryupdate_status
} = require("../models/Model_job.js");


const getAllJob = async (req, res) => {
  console.log("dang get all job ");
  const paging_size =10;
  const active_page=1;
  const paging={paging_size,active_page};
  try {
    const data = await queryGetWorkBySearch({},paging);
    if (data) {
      const total_count = data.length > 0 ? data[0].total_count : 0;
      const totalPages = Math.ceil(total_count / paging_size);
      return res.status(200).json({jobs:data,totalPages });
    }
  } catch (error) {
    console.log("Get Work By Search error:", error);
    res.status(500);
  }
};

const getWorkBySearch = async (req, res) => {
  const {searchData,paging} = req.body;
  // console.log("dang Search Job ", req.body);
  const paging_size = Number(paging.paging_size);
  console.log("dang Search Job ", searchData);
  try {
    const data = await queryGetWorkBySearch(searchData,paging);
    if (data) {
      const total_count = data.length > 0 ? data[0].total_count : 0;
      console.log("total_count ", total_count);
      
      
      const totalPages = Math.ceil(total_count / paging_size);
      console.log("totalPages ", totalPages);
      return res.status(200).json({jobs:data,totalPages });
    }
    else
    {
      return res.status(200).json({jobs:[],totalPages:0 });
    }
  } catch (error) {
    console.log("Get Work By Search error:", error);
    res.status(500);
  }
};

const getWorkDetail = async (req, res) => {
  const postId = req.query.postId;
  try {
    const work = await queryGetWorkDetail(postId);

    if (work) {
      return res.status(200).json({ work });
    }
  } catch (error) {
    console.log("Get Work Detail error:", error);
    res.status(500);
  }
};

const update_status_ = async (req, res) => {
  const body = req.body;
  console.log("dang update status ",body.status_,body.job_ids);
  try {
    const data = await queryupdate_status(body.status_,body.job_ids);

    if (data) {
      return res.status(200).json("SUCCESS");
    }
  } catch (error) {
    console.log("UPDATE STATUS ERROR: ", error);
    res.status(500);
  }
};

const deletejobs = async (req, res) => {
  console.log("delete jobs", req.body);
  const  job_ids  = req.body.job_ids;
  try {
    const result = await querydeletejobs(job_ids);
    if (result) {
      console.log(result);
      return res.status(200).json("SUCCESS");
          }
  }
  catch (error) {
    console.log("DELETE JOBS ERROR: ", error);
    res.status(500);
  }
  
};

module.exports = {
  getWorkDetail,
  getWorkBySearch,
  deletejobs,
  update_status_,
  getAllJob
};
