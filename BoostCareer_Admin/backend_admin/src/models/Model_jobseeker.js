const db = require("../config/databaseConfig.js");

const queryGet_UserInformation = async (id_jobseeker, ) => { // đổi tên sang get_jobseeker_information để không bị nhầm lẫn
  const [userInfor] = await db.query(
    `
  call queryGetJobseeker_Information(?, ?);
    `,
    [id_jobseeker,id_jobseeker]
  );
  return userInfor[0];
};

///////////////////////////////////////////////////////// NEWS ///////////////////////////////////////////////////////////
const queryget_jobseeker_bysearch = async (searchData,paging) => {
  const {
    title,
    job_function_id = null,
    district_id = null,
    level_id = null,
    year_exp = null,
    age_min = null,
    age_max = null,
    gender = null,
    status_ = null,
    language_id = null,
    education_id = null,
  } = searchData;
  const {paging_size=10,
    active_page=1, totalPages} = paging;
 let query = `
    SELECT 
    e.jobseeker_id,
    p.*,
    c.*,
    e.status_ ,
    i.job_function_name,
    d.district_name,
    ct.city_name,
    n.nation_name,
    COUNT(*) OVER() AS total_count
FROM 
    user_ AS c
JOIN 
    user_jobseeker AS e ON c.user_id = e.jobseeker_id
LEFT JOIN
    profile_jobseeker AS p ON c.user_id = p.profile_id
LEFT JOIN 
    catalog_job_function AS i ON i.job_function_id= p.job_function_id
LEFT JOIN 
    catalog_district AS d ON p.district_id = d.district_id
LEFT JOIN 
    catalog_city AS ct ON d.city_id = ct.city_id
LEFT JOIN 
    catalog_nation AS n ON ct.nation_id = n.nation_id
    `;
const conditions = [];
const values = [];

if (title) {
  let temp_query =' (e.jobseeker_id like ? or c.email like ? or c.username LIKE? or p.full_name LIKE ?)';
  conditions.push(temp_query);
  const temp_value = `%${title}%`;
  values.push(temp_value);
  values.push(temp_value);
  values.push(temp_value);
  values.push(temp_value);
}
if (job_function_id) {
  conditions.push(`i.job_function_id = ?`);
  values.push(job_function);}
if (district_id) {
  conditions.push(`d.district_id =?`);
  values.push(district_id);
}
if (level_id) {
conditions.push(`p.level_id =?`);
values.push(level_id);
}
if (year_exp) {
  if(level_id >5){
    conditions.push(`p.year_exp >?`);
    values.push(5);
  }
  else{
    conditions.push(`p.year_exp =?`);
    values.push(level_id);
  }
}
if (age_min) {
conditions.push(`YEAR(CURDATE()) - YEAR(p.birthday) >=?`);
values.push(age_min);
}
if (age_max) {
  conditions.push(`YEAR(CURDATE()) - YEAR(p.birthday) <=?`);
  values.push(age_max);}

if (gender) {
  conditions.push(`p.gender =?`);
  values.push(Number(gender));}
if (status_) {
  conditions.push(`e.status_ =?`);
  values.push(status_);}
if (education_id) {
  query += `LEFT JOIN profile_education as pedu ON p.profile_id = pedu.profile_id`;
  conditions.push(`pedu.language =?`);
  values.push(education_id);}
 if (language_id) {
  query += `LEFT JOIN profile_language as plang ON p.profile_id = plang.profile_id`;
  conditions.push(`plang.language_id =?`);
  values.push(language_id);}
  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }
query +=  ` ORDER BY c.user_id ASC
LIMIT ? OFFSET ?;`;
values.push(Number(paging_size));
values.push((Number(active_page)-1)*Number(paging_size));
const [result] = await db.query(query, values);
  return result;
};

const querydelete_jobseeker_byid = async (jobseeker_ids) => {
  const [jobseeker] = await db.query(`DELETE FROM user_ WHERE user_id IN (?);`,[employer_ids]);
  return jobseeker;
};

const queryupdate_Status_ = async (status_,jobseeker_ids) => {
  const [jobseeker] = await db.query(`UPDATE user_jobseeker
SET status_ = ? WHERE jobseeker_id IN (?);`,[status_,jobseeker_ids]);
  return jobseeker;
};

const querysend_Message = async () => {
  const [jobseeker] = await db.query(` `);

  return jobseeker;
};

const queryreset_Password = async () => {
  const [jobseeker] = await db.query(` `);

  return jobseeker;
};

module.exports = {
  queryGet_UserInformation,     
  queryget_jobseeker_bysearch,
  querydelete_jobseeker_byid,
  queryupdate_Status_,
  querysend_Message,
  queryreset_Password,
};
