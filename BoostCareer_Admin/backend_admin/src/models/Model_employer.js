const db = require("../config/databaseConfig.js");

const queryget_All_employer = async () => {
  const [employer] = await db.query(`
    SELECT 
    c.employer_id,
    c.employer_name,
    c.logo,
    c.scale_id,
    c.industry_id,
    c.phone_number,
    c.describle,
    e.status_ AS employer_status,
    s.scale_min,
    s.scale_max,
    i.industry_name,
    d.district_name,
    ct.city_name,
    n.nation_name
FROM 
    employer AS c
JOIN 
    employer AS e ON c.employer_id = e.employer_id
LEFT JOIN 
    catalog_scale AS s ON c.scale_id = s.scale_id
LEFT JOIN 
    catalog_industry AS i ON c.industry_id = i.industry_id
LEFT JOIN 
    employer_location AS cl ON c.employer_id = cl.employer_id
LEFT JOIN 
    catalog_district AS d ON cl.district_id = d.district_id
LEFT JOIN 
    catalog_city AS ct ON d.city_id = ct.city_id
LEFT JOIN 
    catalog_nation AS n ON ct.nation_id = n.nation_id
LIMIT 5;
    `);

  return employer;
};

const queryget_Employer_bysearch = async (searchData,paging) => {
  const {     
    title= "",
    industry= "",
    work_location= "",
    scale_id= "",     
    employer_status= "",} = searchData;
    const {paging_size=10,active_page=1, totalPages} = paging;
    let query = `SELECT 
    ue.employer_id,
    ue.status_ as employer_status,
    u.username,
    u.email,
    u.phone_number,
    u.create_at,
    u.is_online,
    c.company_name,
    c.logo,
    c.phone_number AS company_phone,
    c.count_follower,
    c.describle AS company_description,
    CONCAT(s.scale_min,'-', s.scale_max) AS scale_total,
    s.scale_id,   
    i.industry_name,
    cl.city_name AS work_location,    
    GROUP_CONCAT(ctb.benefit_name SEPARATOR ', ') AS company_benefits,
    COUNT(*) OVER() AS total_count
    FROM user_employer ue
JOIN user_ u ON ue.employer_id = u.user_id
LEFT JOIN company c ON ue.employer_id = c.company_id
LEFT JOIN catalog_scale s ON c.scale_id = s.scale_id
LEFT JOIN catalog_industry i ON c.industry_id = i.industry_id
LEFT JOIN company_location cloc ON c.company_id = cloc.company_id
LEFT JOIN catalog_city cl ON cloc.city_id = cl.city_id
LEFT JOIN company_benefit cb ON c.company_id = cb.company_id
left join catalog_benefit ctb on ctb.benefit_id= cb.benefit_id
`;
const conditions = [];
const values = [];
if (title) {
  let temp_query =' (ue.employer_id like ? or u.email like ? or c.company_name LIKE?)';
  conditions.push(temp_query);
  const temp_value = `%${title}%`;
  values.push(temp_value);
  values.push(temp_value);
  values.push(temp_value);
}
if (industry) {
  conditions.push(`i.industry_name = ?`);
  values.push(industry);}
if (work_location) {
  conditions.push(`cl.city_name = ?`);
  values.push(work_location);}
if (scale_id) {
  conditions.push(`c.scale_id = ?`);
  values.push(scale_id);}
if (employer_status) {
  conditions.push(`ue.status_ = ?`);
  values.push(employer_status);}
if (conditions.length > 0) {
  query += ` WHERE ${conditions.join(' AND ')}`;
}
query += `
GROUP BY ue.employer_id, u.username, u.email, u.phone_number, u.create_at, u.is_online, 
         c.company_name, c.logo, c.phone_number, c.count_follower, c.describle, 
         s.scale_min, s.scale_max, i.industry_name, cl.city_name
         LIMIT ? OFFSET ?;`;
values.push(Number(paging_size));
values.push((Number(active_page)-1)*Number(paging_size));
const [employer] = await db.query(query, values);
return employer;
};

const querydelete_Employer_byid = async (employer_ids) => {
  const [employer] = await db.query(`DELETE FROM user_ WHERE user_id IN (?);`,[employer_ids]);

  return employer;
};

const queryupdate_Status_ = async (status_,employer_ids) => {
  const [employer] = await db.query(` UPDATE user_employer
SET status_ = ? WHERE employer_id IN (?);`,[status_,employer_ids]);

  return employer;
};

const querysend_Message = async (message) => {
  // dau vao
  const field = ['message_id', 'message_title','sender_id','receiver_id',
                 'is_from_admin','is_read', 'date_time', 'content']
  // const values               
  const [employer] = await db.query(`INSERT INTO message VALUES;`,[message]);

  return employer;
};

const queryreset_Password = async () => {
  const [employer] = await db.query(` `);

  return employer;
};

module.exports = {
  queryget_All_employer,   
  queryget_Employer_bysearch,
  querydelete_Employer_byid,
  queryupdate_Status_,
  querysend_Message,
  queryreset_Password,
};
