const db = require("../config/databaseConfig.js");

const queryGetPublicInformationOfCompany = async (id) => {
  // Lấy thông tin công khai của công ty đang được active (trả về null nếu không tìm thấy/ bị khóa bởi admin)
  try {
    const [result] = await db.query(
      `
     SELECT 
      c.company_id,
      c.company_name,
      c.logo,
      c.background,
      c.describle,
      c.count_follower,
      cs.scale_id,
      cs.scale_max,
      cs.scale_min,
      ci.industry_id,
      ci.industry_name,
      (SELECT COALESCE(
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'benefit_id', cob.benefit_id,
                'benefit_name', cab.benefit_name,
                'benefit_icon', cab.benefit_icon,
                'benefit_value', cob.benefit_value 
            )
        ),JSON_ARRAY()) 
        FROM
        (select * from company_benefit where company_benefit.company_id = c.company_id) as cob
        JOIN catalog_benefit cab ON cab.benefit_id = cob.benefit_id ) as company_benefits,
      ( SELECT COALESCE(
          JSON_ARRAYAGG(
              JSON_OBJECT(
                  'city_id', cl.city_id,
                  'city_name', ct.city_name,
                  'address', cl.address))
          , JSON_ARRAY())
        FROM
          (select * FROM company_location where company_location.company_id = c.company_id) as cl
          JOIN catalog_city ct ON ct.city_id = cl.city_id) as company_location,
      (SELECT count(*) from logs_jobseeker_follow_employer ljfe where ljfe.employer_id = c.company_id) as count_follower,
      (SELECT count(*) from job j where j.employer_id = c.company_id and j.status_=1 and j.date_expi >= NOW()) as count_job_posted,
      (SELECT AVG(lr.score) FROM logs_review lr WHERE lr.company_id = c.company_id) AS average_score,
      (SELECT COALESCE(
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'review_name', pfj.full_name,
            'review_content', lr.content,
            'score', lr.score,
            'date', lr.create_at
  )),JSON_ARRAY())
        FROM 
        (select * from logs_review lr2 WHERE lr2.company_id = c.company_id) lr
        JOIN profile_jobseeker pfj ON lr.jobseeker_id = pfj.profile_id      
        ) AS review_details,
      (SELECT COALESCE(
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'score', score_counts.score,
            'count', score_counts.count)), JSON_ARRAY())
      FROM (  SELECT  score,  COUNT(*) AS count
        FROM 
          logs_review
        WHERE 
          company_id = c.company_id
        GROUP BY 
          score
        ORDER BY
          score DESC
        ) AS score_counts
      ) AS score_distribution
        FROM 
          (select * from company join user_employer e on company.company_id = e.employer_id
          WHERE e.status_ = 1 and company_id = ?) as c
        JOIN catalog_industry ci ON ci.industry_id = c.industry_id
        JOIN catalog_scale cs ON cs.scale_id = c.scale_id;        
    `,
      [id]
    );
    if (result.length === 0) {
      return null;
    }
    return result[0];
  } catch (error) {
    console.error("Error fetching company information:", error);
    throw error; // Rethrow the error to be handled by the calling function
  }
};
// đã xử lý tăng lượng view job khi truy vấn job detail
const queryGetPublicJobDetail = async (job_id) => {
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction(); // Start a transaction
    const [updateResult] = await connection.query(
      "UPDATE job SET views = views + 1 WHERE job_id = ?",
      [job_id]
    );

    if (updateResult.affectedRows === 0) {
      await connection.rollback();
      throw new Error(`Job with ID ${job_id} not found`);
    }

    const [job] = await db.query(
      `
  SELECT 
    j.job_id,
	  j.title, 
    j.employer_id,   
    j.date_post,
    j.date_expi,
    j.address,
    j.quantity,
    j.describle,
    j.working_time,
    j.working_type,
    j.views,
    j.salary_max,
    j.salary_min,
    j.require_experience,
    j.require_gender,
    j.require_marital_status,
    j.require_age_max,
    j.require_age_min,
    j.more_requirements,
	  c.company_name,
    c.logo AS company_logo,
    c.background,
    ci.industry_id,
    ci.industry_name,
    func.job_function_id,
    func.job_function_name,
    loc.city_id,
    loc.city_name AS work_location_name,
    lvl.level_id,
    lvl.level_name AS job_level_name,
    j.require_education,
    edu.education_title,
    (SELECT COALESCE(
      JSON_ARRAYAGG(
              JSON_OBJECT(
                  'benefit_id', cob.benefit_id,
                  'benefit_name', cab.benefit_name,
                  'benefit_icon', cab.benefit_icon,
                  'benefit_value', cob.benefit_value 
              )
          ),JSON_ARRAY())  
      FROM
        (select * from company_benefit where company_id = j.employer_id) as cob
      JOIN catalog_benefit cab ON cab.benefit_id = cob.benefit_id ) AS company_benefits,
    (SELECT COALESCE(
        JSON_ARRAYAGG(
            JSON_OBJECT(
				'skill_id', js.skill_id,
          'skill_name', cta.tags_content
            )
        ),JSON_ARRAY())  
      FROM 
      (select * from job_require_skill where job_require_skill.job_id = j.job_id) as js
      JOIN catalog_tags cta on cta.tag_id = js.skill_id) AS job_skills,
    (SELECT COALESCE(
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'language_id', ctl.language_id,
                'language_name', ctl.language_name,
                'metric_display', ctl.metric_display )
          ), JSON_ARRAY())
      FROM
        (select * from job_require_language where job_require_language.job_id = j.job_id) as jrl 
      JOIN
        catalog_language ctl ON ctl.language_id = jrl.language_id) AS languages,
     (SELECT COALESCE(
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'certification', jrc.certification)
            ), JSON_ARRAY())
            FROM job_require_certification jrc
            where jrc.job_id = j.job_id
            ) as certification         
  FROM
      (select * from job where status_ = 1 and job_id =?) as j
  JOIN
      company c ON j.employer_id = c.company_id
  JOIN
      catalog_industry ci ON j.industry_id = ci.industry_id
  JOIN
      catalog_job_function func ON j.job_function_id = func.job_function_id
  JOIN
      catalog_city loc ON j.work_location = loc.city_id    
  JOIN
      catalog_level lvl ON j.level_id = lvl.level_id
  JOIN
      catalog_education edu ON j.require_education = edu.education_id;
    `,
      [job_id]
    );
    await connection.commit();
    return job[0];
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Error fetching job details:", error);
    throw error; // Rethrow the error to be handled by the calling function
  } finally {
    if (connection) connection.release();
  }
};

const queryGetListJobBySearch = async (searchData) => {
  try {
    const {
      title,
      industry_id = null,
      job_function_id = null,
      work_location = null,
      salary_expect = null,
      level_id = null,
      working_type= null,
      skills = null,
      require_experience = null,
      paging_size = 10,
      active_page = 1,
      sort_by = "date_post",
      ...prop
    } = searchData;

    const status_ = 1; // Chỉ lấy các công việc đang hoạt động
    let query = `
      SELECT 
        j.job_id,
        j.title, 
        j.employer_id,   
        j.date_post,
        j.date_expi,
        j.quantity,
        j.salary_max,
        j.salary_min,
        c.company_name,
        c.logo AS company_logo,
        c.background,
        ind.industry_id,
        ind.industry_name,
        func.job_function_id,
        func.job_function_name,
        loc.city_id,
        loc.city_name AS work_location_name,
        lvl.level_id,
        lvl.level_name AS job_level_name,
        ( SELECT COALESCE(
            JSON_ARRAYAGG(
                JSON_OBJECT(
            'skill_id', js.skill_id,
              'skill_name', cta.tags_content
                )
            ),JSON_ARRAY())  
          FROM 
              (select * from job_require_skill where job_require_skill.job_id = j.job_id) as js
          JOIN catalog_tags cta on cta.tag_id = js.skill_id) AS job_skills,
        COUNT(*) OVER() AS total_count
      FROM 
          (select * from job where status_ = 1) as j
      JOIN
          company c ON j.employer_id = c.company_id
      JOIN
          catalog_industry ind ON j.industry_id = ind.industry_id
      JOIN
          catalog_job_function func ON j.job_function_id = func.job_function_id
      JOIN
          catalog_city loc ON j.work_location = loc.city_id
      JOIN
          catalog_level lvl ON j.level_id = lvl.level_id
      JOIN
          catalog_education edu ON j.require_education = edu.education_id
        `;
    const conditions = [];
    const values = [];
    if (title) {
      const title2 = `%${title}%`;
      conditions.push("j.title LIKE ?");
      values.push(title2);
    }
    if (skills) {
      query += ` JOIN
        (SELECT * FROM job_require_skill js WHERE js.skill_id IN (?)) AS js ON j.job_id = js.job_id`;
      values.push(skills); 
    }
    if (industry_id) {
      conditions.push("j.industry_id = ?");
      values.push(industry_id);
    }
    if (job_function_id) {
      conditions.push("j.job_function_id = ?");
      values.push(job_function_id);
    }
    if (working_type) {
      conditions.push("j.working_type = ?");
      values.push(working_type);
    }
    if (work_location) {
      conditions.push("j.work_location = ?");
      values.push(work_location);
    }
    if (status_) {
      conditions.push("j.date_expi >= NOW()");
    }
    if (salary_expect) {
      conditions.push("j.salary_max >= ?");
      values.push(salary_expect);
    }
    if (level_id) {
      conditions.push("j.level_id = ?");
      values.push(level_id);
    }

    if (require_experience) {
      switch (require_experience) { 
        case '1':
          conditions.push("j.require_experience <= ?");
          values.push(1);
          break;
        case '2':
          conditions.push("j.require_experience >= 1");
          conditions.push("j.require_experience <= 3");
          break;
        case '3':
          conditions.push("j.require_experience >= 3");
          conditions.push("j.require_experience <= 5");
          break;
        case '4':
          conditions.push("j.require_experience >= 5");
          break;
        case '5':
          conditions.push("j.require_experience >= 10");
          break;
        default:
          break;
      } 
    }
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }
    query += ` ORDER BY ${sort_by} DESC
    LIMIT ? OFFSET ?;`;
    values.push(Number(paging_size));
    values.push((Number(active_page) - 1) * Number(paging_size));
    const [result] = await db.query(query, values);
    return result;
  } catch (error) {
    console.error("Error fetching jobs by search:", error);
    throw error; // Rethrow the error to be handled by the calling function
  }
};

const queryGetListJobOfCompany = async (companyId) => {
  try {
    // console.log("companyId", companyId);
    const [result] = await db.query(
      `
      SELECT 
        j.job_id,
        j.title, 
        j.employer_id,   
        j.date_post,
        j.date_expi,
        j.quantity,
        j.salary_max,
        j.salary_min,
        c.company_name,
        c.logo AS company_logo,
        c.background,
        ind.industry_id,
        ind.industry_name,
        func.job_function_id,
        func.job_function_name,
        loc.city_id,
        loc.city_name AS work_location_name,
        lvl.level_id,
        lvl.level_name AS job_level_name,
        ( SELECT COALESCE(
            JSON_ARRAYAGG(
                JSON_OBJECT(
            'skill_id', js.skill_id,
              'skill_name', cta.tags_content
                )
            ),JSON_ARRAY())  
          FROM 
              (select * from job_require_skill where job_require_skill.job_id = j.job_id) as js
          JOIN catalog_tags cta on cta.tag_id = js.skill_id) AS job_skills,
        COUNT(*) OVER() AS total_count
      FROM 
          (select * from job where status_ = 1 and employer_id = ? and date_expi >=NOW()) as j
      JOIN
          company c ON j.employer_id = c.company_id
      JOIN
          catalog_industry ind ON j.industry_id = ind.industry_id
      JOIN
          catalog_job_function func ON j.job_function_id = func.job_function_id
      JOIN
          catalog_city loc ON j.work_location = loc.city_id
      JOIN
          catalog_level lvl ON j.level_id = lvl.level_id
      JOIN
          catalog_education edu ON j.require_education = edu.education_id;
        `,
      [companyId]
    );

    // console.log("result", result);
    if (result.length === 0) {
      return null;
    }
    return result;
  } catch (error) {
    console.error("Error fetching jobs of company:", error);
    throw error; // Rethrow the error to be handled by the calling function
  }
};

const queryGetListLeadingCompany = async (paging_size) => {
  try {
    const [companies] = await db.query(
      `
              SELECT
                  c.company_id,
                  c.company_name,
                  c.logo,
                  c.background,
                  c.describle,
                  c.count_follower,
                  cs.scale_id,
                  cs.scale_max,
                  cs.scale_min,
                  ci.industry_id,
                  ci.industry_name,
                  (SELECT COALESCE(
                        JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'city_id', cl.city_id,
                                'city_name', ct.city_name,
                                'address', cl.address))
                        , JSON_ARRAY())
                  from 
                        (select * FROM company_location where company_location.company_id = c.company_id) as cl
                        JOIN catalog_city ct ON ct.city_id = cl.city_id
                        ) AS company_location,
                  (SELECT count(*) from logs_jobseeker_follow_employer ljfe where ljfe.employer_id = c.company_id) as count_follower,
                  (SELECT count(*) from job j where j.employer_id = c.company_id and j.status_=1 and j.date_expi >= NOW()) as count_job_posted,
                  (SELECT AVG(lr.score) FROM logs_review lr WHERE lr.company_id = c.company_id) AS average_score,
                  COUNT(*) OVER() AS total_count
                  FROM
                    (select * from company
                      join user_employer e on company.company_id = e.employer_id
                      WHERE e.status_ = 1) as c
                  JOIN catalog_industry ci ON c.industry_id = ci.industry_id
                  JOIN catalog_scale cs on cs.scale_id = c.scale_id
                  ORDER BY count_job_posted DESC, count_follower DESC, average_score DESC
                  LIMIT ? OFFSET 0;`,
      [paging_size]
    );
    return companies;
  } catch (error) {
    console.error("Error fetching leading companies:", error);
    throw error; // Rethrow the error to be handled by the calling function
  }
};

const queryGetListCompanyBySearch = async (searchData) => {
  try {
    const {
      title = "",
      industry_id = "",
      city_id = "",
      paging_size = 10,
      active_page = 1,
    } = searchData;
    let query = `
SELECT
    c.company_id,
    c.company_name,
    c.logo,
    c.background,
    c.describle,
    c.count_follower,
    cs.scale_id,
    cs.scale_max,
    cs.scale_min,
    ci.industry_id,
    ci.industry_name,
    (SELECT COALESCE(
          JSON_ARRAYAGG(
              JSON_OBJECT(
                  'city_id', cl.city_id,
                  'city_name', ct.city_name,
                  'address', cl.address))
          , JSON_ARRAY())
	  from 
          (select * FROM company_location where company_location.company_id = c.company_id) as cl
          JOIN catalog_city ct ON ct.city_id = cl.city_id
          ) AS company_location,
    (SELECT count(*) from logs_jobseeker_follow_employer ljfe where ljfe.employer_id = c.company_id) as count_follower,
    (SELECT count(*) from job j where j.employer_id = c.company_id and j.status_=1 and j.date_expi >= NOW()) as count_job_posted,
    (SELECT AVG(lr.score) FROM logs_review lr WHERE lr.company_id = c.company_id) AS average_score,
    COUNT(*) OVER() AS total_count
    FROM
      (select * from company
        join user_employer e on company.company_id = e.employer_id
        WHERE e.status_ = 1) as c
    JOIN catalog_industry ci ON c.industry_id = ci.industry_id
    JOIN catalog_scale cs on cs.scale_id = c.scale_id
`;

    const conditions = [];
    const values = [];
    if (city_id) {
      query += ` JOIN 
    (SELECT * FROM company_location cl WHERE cl.city_id = ?) AS cl1 ON c.company_id = cl1.company_id`;
      values.push(city_id);
    }

    if (title) {
      conditions.push("c.company_name LIKE ? ");
      values.push(`%${title}%`);
    }
    if (industry_id) {
      conditions.push(`ci.industry_id= ? `);
      values.push(industry_id);
    }
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }
    query += `  ORDER BY count_job_posted DESC, count_follower DESC, average_score DESC
         LIMIT ? OFFSET ?;`;
    values.push(Number(paging_size));
    values.push((Number(active_page) - 1) * Number(paging_size));
    const [companies] = await db.query(query, values);
    return companies;
  } catch (error) {
    console.error("Error fetching companies by search:", error);
    throw error; // Rethrow the error to be handled by the calling function
  }
};

const queryGetGeneralInfo = async () => {
  try {
    const [leadingcompany] = await db.query(
      `
      SELECT
                  c.company_id,
                  c.company_name,
                  c.logo,
                  c.background,
                  c.describle,
                  c.count_follower,
                  cs.scale_id,
                  cs.scale_max,
                  cs.scale_min,
                  ci.industry_id,
                  ci.industry_name,
                  (SELECT COALESCE(
                        JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'city_id', cl.city_id,
                                'city_name', ct.city_name,
                                'address', cl.address))
                        , JSON_ARRAY())
                  from 
                        (select * FROM company_location where company_location.company_id = c.company_id) as cl
                        JOIN catalog_city ct ON ct.city_id = cl.city_id
                        ) AS company_location,
                  (SELECT count(*) from logs_jobseeker_follow_employer ljfe where ljfe.employer_id = c.company_id) as count_follower,
                  (SELECT count(*) from job j where j.employer_id = c.company_id and j.status_=1 and j.date_expi >= NOW()) as count_job_posted,
                  (SELECT AVG(lr.score) FROM logs_review lr WHERE lr.company_id = c.company_id) AS average_score,
                  COUNT(*) OVER() AS total_count
                  FROM
                    (select * from company
                      join user_employer e on company.company_id = e.employer_id
                      WHERE e.status_ = 1) as c
                  JOIN catalog_industry ci ON c.industry_id = ci.industry_id
                  JOIN catalog_scale cs on cs.scale_id = c.scale_id
                  ORDER BY count_job_posted DESC, count_follower DESC, average_score DESC
                  LIMIT 5 OFFSET 0;
      `
    );
    const [job_count] = await db.query(
      `
      SELECT count(*) as total_job from job j where j.status_ = 1 and j.date_expi >= NOW() ;
      `
    );
    const [company_count] = await db.query(
      `
      SELECT count(*) as total_company from user_employer c where c.status_ = 1 ;
      `
    );
    const [jobseeker_count] = await db.query(
      `
      SELECT count(*)  as total_jobseeker from user_jobseeker p where p.status_ = 1;
      `
    );
    const [JobCountByIndustry] = await db.query(
      `SELECT 
            ci.industry_id,
            ci.industry_name,
            ci.icon,
            COUNT(j.job_id) AS job_count
          FROM catalog_industry ci
          LEFT JOIN job j ON ci.industry_id = j.industry_id AND j.status_ = 1 AND j.date_expi >= NOW()
          GROUP BY ci.industry_id, ci.industry_name order by job_count DESC limit 8;`
        );
    const result = {
      leadingcompany: leadingcompany,
      job_count: job_count[0].total_job,
      company_count: company_count[0].total_company,
      jobseeker_count: jobseeker_count[0].total_jobseeker,
      JobCountByIndustry: JobCountByIndustry,
    };
    return result;
  } catch (error) {
    console.error("Error fetching general info:", error);
    throw error; // Rethrow the error to be handled by the calling function
  }
};

// đang lấy đơn giản 5 job liên quan đến job_id
const queryGetRelatedJobs = async (job_id) => {
  try {
    const [job] = await db.query(
    `SELECT
        title,
        industry_id,
        job_function_id,
        employer_id,
        work_location
    from job j where job_id = ? AND  j.status_ = 1 ;`, //AND j.date_expi >= NOW()
      [job_id]);
    if (job.length === 0) {
      throw new Error("Không tìm thấy job");
    }
    const [related_1] = await db.query(
      `SELECT 
        j.job_id,
        j.title,
        j.salary_min,
        j.salary_max,        
        c.company_name,
        c.logo as company_logo,
        (select city_name from catalog_city where city_id = j.work_location) as work_location_name
      FROM job j
      JOIN company c ON j.employer_id = c.company_id
      WHERE j.status_ = 1 AND j.date_expi >= NOW()
      and j.job_function_id = ? and j.work_location = ? and j.job_id != ?
      ORDER BY j.create_at DESC
      LIMIT 5;`,[job[0].job_function_id, job[0].work_location,job_id]
    );
    const [related_2] = await db.query(
      `SELECT 
        j.job_id,
        j.title,
        j.salary_min,
        j.salary_max,
        c.company_name,
        c.logo as company_logo,
        (select city_name from catalog_city where city_id = j.work_location) as work_location_name
      FROM job j
      JOIN company c ON j.employer_id = c.company_id
      WHERE j.status_ = 1 AND j.date_expi >= NOW()
      and j.employer_id = ?  and j.job_id != ?
      ORDER BY j.create_at DESC
      LIMIT 5;`,[job[0].employer_id,job_id]
    );
    const [related_3] = await db.query(
      `SELECT 
        j.job_id,
        j.title,
        j.salary_min,
        j.salary_max,
        c.company_name,
        c.logo as company_logo,
        (select city_name from catalog_city where city_id = j.work_location) as work_location_name
      FROM job j
      JOIN company c ON j.employer_id = c.company_id
      WHERE j.status_ = 1 AND j.date_expi >= NOW()  
      and j.title like ? and j.work_location = ?  and j.job_id != ?
      ORDER BY j.create_at DESC
      LIMIT 5;`,[`%${job[0].title}%`,job[0].work_location,job_id]
    );
    const data = [];
    if (related_1.length !== 0) {
      data.push(...related_1);
    }
    if (related_2.length !== 0) {
      data.push(...related_2);
    }
    if (related_3.length !== 0) {
      data.push(...related_3);
    }
    if (data.length > 5) {
      const result = data.sort(() => 0.5 - Math.random()).slice(0, 5);
      return result; 
    }
    return data; // Trả về danh sách việc làm liên quan
   
 
  } catch (error) {
    console.error("Error fetching related jobs:", error);
    throw error; // Rethrow the error to be handled by the calling function
  }
}


module.exports = {
  queryGetPublicInformationOfCompany,
  queryGetPublicJobDetail,
  queryGetListJobBySearch,
  queryGetListJobOfCompany,
  queryGetListLeadingCompany,
  queryGetListCompanyBySearch,
  queryGetGeneralInfo,
  queryGetRelatedJobs,
  
};
