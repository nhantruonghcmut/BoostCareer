const crypto = require('crypto');
const bcrypt = require('bcrypt');
const {  
  queryget_All_employer,   
  queryget_Employer_bysearch,
  querydelete_Employer_byid,
  queryupdate_Status_,
  querysend_Message,
  queryreset_Password, 
} = require("../models/Model_employer.js");


const get_All_employer = async (req, res) => {
  console.log("dang get all employer ");
  const paging_size =10;
  const active_page=1;
  const paging={paging_size,active_page};
  try {
    const data = await queryget_Employer_bysearch({},paging);
    if (data) {
      const total_count = data.length > 0 ? data[0].total_count : 0;
      const totalPages = Math.ceil(total_count / paging_size);
      return res.status(200).json({employers:data,totalPages });
    }
  } catch (error) {
    console.log("Get Employer By Search error:", error);
    res.status(500);
  }
};

const get_Employer_bysearch = async (req, res) => {
  const {searchData,paging} = req.body;
  const paging_size = Number(paging.paging_size);
  console.log("dang Search Employer ", paging);
  try {
    const data = await queryget_Employer_bysearch(searchData,paging);
    if (data) {
      const total_count = data.length > 0 ? data[0].total_count : 0;
      const totalPages = Math.ceil(total_count / paging_size);
      return res.status(200).json({employers:data,totalPages });
    }
    else
    {
      return res.status(200).json({jobs:[],totalPages:0 });
    }
  } catch (error) {
    console.log("Get Employer By Search error:", error);
    res.status(500);
  }
};

const delete_Employers = async (req, res) => {
  const  employer_ids  = req.body.employer_ids;
  try {
    const result = await querydelete_Employer_byid(employer_ids);

    if (result) {
      return res.status(200).json( "SUCCESS" );
    }
  } catch (error) {
    console.log("DELETE JOBS ERROR: ", error);
    res.status(500);
  }
};

const update_Status_ = async (req, res) => {
  try {
    const data = req.body;
    console.log("dang update status ",req.body);
    const {status_,employer_ids}  = req.body;
    const result = await queryupdate_Status_(status_,employer_ids);

    if (result) {
      return res.status(200).json( "SUCCESS" );
    }
  } catch (error) {
    console.log("UPDATE STATUS ERROR: ", error);
    res.status(500);
  }
};

const send_Message = async (req, res) => {
  try {
    const {employer_ids}  = req.body.employer_ids;
    const employer = await querysend_Message();

    if (employer) {
      return res.status(200).json({ employer });
    }
  } catch (error) {
    console.log("Get Leading employer error:", error);
    res.status(500);
  }
};

const reset_Password = async (req, res) => {
  try {
    const employer_ids = await queryreset_Password();

    if (employer) {
      return res.status(200).json({ employer });
    }
  } catch (error) {
    console.log("Get Leading employer error:", error);
    res.status(500);
  }
};

module.exports = { 
  get_All_employer,   
  get_Employer_bysearch,
  delete_Employers,
  update_Status_,
  send_Message,
  reset_Password, 
};
