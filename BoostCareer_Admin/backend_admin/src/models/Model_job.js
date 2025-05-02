const db = require("../config/databaseConfig.js");
const queryGetWorkDetail = async (workId) => {
  const [work] = await db.query(
    `
      SELECT 
    j.*,
    u.username AS employer_name,
    c.company_name,
    c.logo AS company_logo,
    ind.industry_name,
    func.job_function_name,
    loc.city_name AS work_location_name,
    lvl.level_name AS job_level_name,
    edu.education_title AS education_requirement,
    GROUP_CONCAT(b.benefit_name SEPARATOR ', ') AS catalog_benefit,
    (SELECT GROUP_CONCAT(js.skill_id SEPARATOR ', ')
     FROM job_require_skill js
     WHERE js.job_id = j.job_id) AS job_skills,
    GROUP_CONCAT(DISTINCT l.language_name SEPARATOR ', ') AS languages -- Sử dụng DISTINCT để loại bỏ trùng lặp
FROM
    job j
LEFT JOIN
    user_employer e ON j.employer_id = e.employer_id
LEFT JOIN
    user_ u ON e.employer_id = u.user_id
LEFT JOIN
    company c ON e.employer_id = c.company_id
LEFT JOIN
    catalog_industry ind ON j.industry_id = ind.industry_id
LEFT JOIN
    catalog_job_function func ON j.job_function_id = func.job_function_id
LEFT JOIN
    catalog_city loc ON j.work_location = loc.city_id
LEFT JOIN
    catalog_level lvl ON j.level_id = lvl.level_id
LEFT JOIN
    catalog_education edu ON j.require_education = edu.education_id
LEFT JOIN
    company_benefit cb ON c.company_id = cb.company_id
LEFT JOIN
    catalog_benefit b ON cb.benefit_id = b.benefit_id 
LEFT JOIN
    job_require_language jrl ON j.job_id = jrl.job_id -- Join với job_require_language
LEFT JOIN
    catalog_language l ON jrl.language_id = l.language_id -- Join với catalog_language
WHERE
    j.job_id = ?
GROUP BY
    j.job_id
LIMIT 1;
    `,
    [workId]
  );
  console.log(work);
  return work;
};

const querydeletejobs = async (job_ids) => {
  // console.log(typeof jobId);
  const [resut] = await db.query(
    `
      DELETE FROM job WHERE job_id IN (?);
    `,
    [job_ids]
  );
  return resut;
};

const queryGetWorkBySearch = async (searchData,paging) => {
  const {
    title,
    industry = null,
    job_function = null,
    company_name = null,
    work_location = null,
    salary_max = null,
    salary_min = null,
    level_id = null,
    require_marital_status = null,
    require_education = null,
    require_experience = null,
    status_ = null,
    date_from = null,
    date_to = null
  } = searchData;
  const {paging_size=10,
    active_page=1, totalPages} = paging;

   let query =
    `
      SELECT 
      j.*,
      u.username AS employer_name,
      c.company_name,
      c.logo AS company_logo,
      ind.industry_name,
      func.job_function_name,
      loc.city_name AS work_location_name,
      lvl.level_name AS job_level_name,
      edu.education_title AS education_requirement,
      COUNT(*) OVER() AS total_count
  FROM 
      job j
  JOIN 
      user_employer e ON j.employer_id = e.employer_id
  JOIN 
      user_ u ON e.employer_id = u.user_id
  JOIN 
      company c ON e.employer_id = c.company_id
  JOIN 
      catalog_industry ind ON j.industry_id = ind.industry_id
  JOIN 
      catalog_job_function func ON j.job_function_id = func.job_function_id
  JOIN 
      catalog_city loc ON j.work_location = loc.city_id
  JOIN 
      catalog_level lvl ON j.level_id = lvl.level_id
  LEFT JOIN 
      catalog_education edu ON j.require_education = edu.education_id
      `;
  const conditions = [];
  const values = [];
  if (title) {
    const title2 = `%${title}%`;
    conditions.push("title LIKE ?");
    values.push(title2);
  }

  if (industry) {
    conditions.push("j.industry_id = ?");
    values.push(industry);
  }
  if (job_function) {
    conditions.push("j.job_function_id = ?");
    values.push(job_function);
  }
  if (company_name) {
    const company_name2 = `%${company_name}%`;
    conditions.push("c.company_name LIKE ?");    
    values.push(company_name2);
  }
  if (work_location) {
    conditions.push("j.work_location = ?");
    values.push(work_location);
  }
  const currentDate = new Date().toISOString().split("T")[0];
  if (status_) {
    conditions.push("j.status_ = ?");
    values.push(status_);
  }
  if (date_from) {
    conditions.push("date_post >= ?");
    values.push(date_from);
  }
  if (date_to) {
    conditions.push("date_post <= ?");
    values.push(date_to);
  }
  if (salary_max) {
    conditions.push("salary_max <= ?");
    values.push(salary_max);
  }
  if (salary_min) {
    conditions.push("salary_min >= ?");
    values.push(salary_min);
  }
  if (level_id) {
    conditions.push("j.level_id = ?");
    values.push(level_id);
  }
  if (require_experience) {
    switch (require_experience) {
      case "0":
        break;
      case "1":
        conditions.push("require_experience <=1");
        break;
      case "2":
        conditions.push("require_experience >= 1 AND require_experience <= 3");
        break;
      case "3":
        conditions.push("require_experience >= 3 AND require_experience <= 5");
        break;
      case "4":
        conditions.push("require_experience >= 5 AND require_experience <= 10");
        break;
      case "5":
        conditions.push("require_experience >=10");
        break;
      default:
        break;
    }    
    // values.push(require_experience);
  }
  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }
  query +=
   ` ORDER BY j.date_post DESC
  LIMIT ? OFFSET ?;`;
  values.push(Number(paging_size));
  values.push((Number(active_page)-1)*Number(paging_size));
  console.log("query", query);
  console.log("values", values);
  const [result] = await db.query(query, values);
  return result;
};

const queryupdate_status = async (status_,job_ids) => {
  const [resut] = await db.query(
    `     UPDATE job
SET status_ = ? WHERE job_id IN (?);
; `,
    [status_,job_ids]
  );
  console.log(job_ids);
  return resut;
};

module.exports = {
  queryGetWorkDetail,
  queryGetWorkBySearch,
  querydeletejobs,
  queryupdate_status
};
