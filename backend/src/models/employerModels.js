import db from "../config/databaseConfig.js";
import JobTables from "../config/table_for_job.js";
import EmployerTables from "../config/table_for_employer.js";
import table_for_job from "../config/table_for_job.js";

///////////////////////////////////////////////////////////////////////////
// Jobseeker Queries
const queryGetListJobseekerBySearch = async (searchData) => {
  const {
    job_function_id = null,
    level_id = null,
    year_exp = null,
    age_min = null,
    age_max = null,
    gender = null,
    language_id = null,
    education_id = null,
    paging_size = 10,
    active_page = 1,
    skill_id = null,
    sort_by = "latest",
    ...props
  } = searchData;
  const status_ = 1;
  let query = `
    SELECT 
    p.profile_id,
    p.full_name,
    p.title,
    p.year_exp,
    p.career_target,
    u.email,
    u.phone_number,
    e.status_ ,
    e.avatar,
    e.is_open_for_job,
    i.job_function_name,
    cl.level_name, 
    COALESCE((Select avg(lrj.score) from logs_employer_rate_jobseeker lrj where lrj.jobseeker_id = p.profile_id),0) as score,
    COUNT(*) OVER() AS total_count
FROM 
    user_ AS u
JOIN 
    user_jobseeker AS e ON u.user_id = e.jobseeker_id
JOIN
    profile_jobseeker AS p ON u.user_id = p.profile_id
JOIN 
    catalog_job_function AS i ON i.job_function_id= p.job_function_id
JOIN
    catalog_level AS cl ON cl.level_id = p.level_id
    `;

  const conditions = [];
  const values = [];
  if (education_id) {
    query += `JOIN
    (select * from profile_education where profile_education.education_id >=?) as pedu ON p.profile_id = pedu.profile_id`;
    values.push(education_id);
  }
  if (job_function_id) {
    conditions.push(`i.job_function_id = ?`);
    values.push(job_function_id);
  }

  if (level_id) {
    conditions.push(`p.level_id =?`);
    values.push(level_id);
  }
  if (age_min) {
    conditions.push(`YEAR(CURDATE()) - YEAR(p.birthday) >=?`);
    values.push(age_min);
  }
  if (age_max) {
    conditions.push(`YEAR(CURDATE()) - YEAR(p.birthday) <=?`);
    values.push(age_max);
  }

  if (gender) {
    conditions.push(`p.gender = ? `);
    values.push(gender);
  }
  if (status_) {
    conditions.push(`e.status_ = ? `);
    values.push(status_);
  }
  if (language_id) {
    query += `JOIN profile_language as plang ON p.profile_id = plang.profile_id`;
    conditions.push(`plang.language_id =?`);
    values.push(language_id);
  }

  if (year_exp) {
    switch (year_exp) {
      case "0": {
        conditions.push(`p.year_exp <= ?`);
        values.push(1);
        break;
      }
      case "1": {
        conditions.push(`p.year_exp >=?`);
        conditions.push(`p.year_exp <=?`);
        values.push(1);
        values.push(3);
        break;
      }
      case "2": {
        conditions.push(`p.year_exp >=?`);
        conditions.push(`p.year_exp <=?`);
        values.push(3);
        values.push(5);
        break;
      }
      case "3": {
        conditions.push(`p.year_exp >=?`);
        values.push(5);
        break;
      }
      case "4": {
        conditions.push(`p.year_exp >=?`);
        values.push(10);
        break;
      }
    }
  }
  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }
  if (sort_by) {
    if (sort_by === "latest") {
      query += ` ORDER BY p.create_at DESC `;
    } else if (sort_by === "complete") {
      query += ` ORDER BY p.percent_complete ASC`;
    } else if (sort_by === "rating") {
      query += ` ORDER BY score DESC`;
    }
  }
  query += ` LIMIT ? OFFSET ?;`;
  values.push(Number(paging_size));
  values.push((Number(active_page) - 1) * Number(paging_size));
  // console.log("query", query);
  // console.log("values", values);
  const [result] = await db.query(query, values);
  return result;
};

// đã xử lý thêm logs khi truy vấn
const queryGetJobseekerDetail = async (employer_id, jobseeker_id) => {
  let connection;
  try {
    connection = await db.getConnection(); // Lấy kết nối từ pool
    await connection.beginTransaction(); // Bắt đầu giao dịch
    const create_at = new Date();
    const [jobseeker_detail] = await db.query(
      `
      select
      js.avatar,
      pjs.*,
      u.email,
      js.is_open_for_job,
      u.phone_number,
      (select cl.level_name from catalog_level cl where pjs.level_id = cl.level_id) as level_name,
      (select cc.city_name from catalog_city cc where pjs.city_id = cc.city_id) as work_expected_place,
      (COALESCE ((select 
            JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'major', pe.major,
                        'school', pe.school,
                        'from_', pe.from_,
                        'to_', pe.to_
                    )
              )
            from  profile_education pe where js.jobseeker_id = pe.profile_id),JSON_ARRAY())) 
		AS education_info,
      (COALESCE ((select 
            JSON_ARRAYAGG(
              JSON_OBJECT(
                  'certification', pcer.certifications,
                  'month', pcer.month_
              )
              )
              from  profile_certification pcer where js.jobseeker_id = pcer.profile_id
              ),JSON_ARRAY())
          ) 
	  AS certification_info,            
      (COALESCE ((SELECT          
					  JSON_ARRAYAGG(
							  JSON_OBJECT(
								  'exp_title', pexp.exp_title,
								  'exp_from', pexp.exp_from,
								  'exp_to', pexp.exp_to,
								  'exp_company', pexp.exp_company,
								  'exp_description', pexp.exp_description
							  )
						  )  
          FROM  profile_experience pexp where js.jobseeker_id = pexp.profile_id),JSON_ARRAY() ))
		AS experience_info,  
		(COALESCE (( SELECT 
                JSON_ARRAYAGG(
                              JSON_OBJECT(
                                  'project_name', ppro.project_name,
                                  'project_from', ppro.project_from,
                                  'project_to', ppro.project_to,
                                  'project_description', ppro.project_description
                              )
                          ) 
           from profile_project ppro where js.jobseeker_id = ppro.profile_id) , JSON_ARRAY()))
		AS project_info,
      (COALESCE(( SELECT 
            JSON_ARRAYAGG(
                    JSON_OBJECT(
                      'skill_id', pski2.skill_id,
                      'skill_name', ctag.tags_content
                    )
                )            
            from 
              (select * from profile_skill pski where js.jobseeker_id = pski.profile_id) pski2
              join catalog_tags ctag on pski2.skill_id=ctag.tag_id),JSON_ARRAY())) 
		AS skill_info,
      (COALESCE( (select profile_cv.cv_link from profile_cv where profile_cv.profile_id = js.jobseeker_id and isactive = 1), '')) AS cv_link,
      (COALESCE( (select JSON_ARRAYAGG(
              JSON_OBJECT(
                  'language_id', plt.language_id,
                  'language_name', pltc.language_name,
                  'metric_display', pltc.metric_display,
                  'language_metrict', pltc.language_metrict
              )
          )
           from 
           (select * from profile_language pl where pl.profile_id = js.jobseeker_id) as plt
           JOIN catalog_language pltc ON pltc.language_id = plt.language_id), JSON_ARRAY())) 
		AS language_info         
      from user_jobseeker js
      join profile_jobseeker pjs on js.jobseeker_id = pjs.profile_id
      join user_ u on js.jobseeker_id = u.user_id  
      where js.jobseeker_id = ?;
      `,
      [jobseeker_id]
    );

    //{ nguyên cụm lấy data rating}
    const [summaryStats] = await db.query(
      `SELECT 
        COUNT(*) as total_ratings,
        round(AVG(score),1) as average_score
      FROM 
        logs_employer_rate_jobseeker
      WHERE 
        jobseeker_id = ?`,
      [jobseeker_id]
    );
    const [ratings] = await db.query(
      `SELECT 
        score, 
        COUNT(*) as count_ratings
      FROM 
        logs_employer_rate_jobseeker
      WHERE 
        jobseeker_id = ?
      GROUP BY 
        score
      ORDER BY 
        score DESC`,
      [jobseeker_id]
    );
    const [employerRating] = await db.query(
      `SELECT * from logs_employer_rate_jobseeker WHERE jobseeker_id= ? and employer_id = ?`,
      [jobseeker_id, employer_id]
    );
    // console.log("employerRating", employerRating);
    const fullRatingScale = [5, 4, 3, 2, 1].map((score) => {
      if (!ratings || !ratings.length) {
        return {
          score: score,
          count_ratings: 0,
        };
      }
      const existingRating = ratings.find((r) => r.score === score);
      return {
        score: score,
        count_ratings: existingRating ? existingRating.count_ratings : 0,
      };
    });
    const ratingData = {
      score: fullRatingScale,
      total_ratings: summaryStats[0].total_ratings || 0,
      averageScore: summaryStats[0].average_score || 0,
      create_at: employerRating[0] ? employerRating[0].create_at : null,
      employer_id: employer_id,
      employer_coment: employerRating[0] ? employerRating[0].content : null,
      employer_score: employerRating[0] ? employerRating[0].score : null,
    };
    //{ kết thúc cụm lấy data rating}

    // thêm vào logs, kiểm tra xem đã có chưa: nếu có rồi thì chỉ update ngày xem
    const [checkLogsView] = await db.query(
      `SELECT * FROM logs_employer_view_jobseeker WHERE employer_id = ? and jobseeker_id = ?`,
      [employer_id, jobseeker_id]
    );
    console.log("checkLogsView", checkLogsView);
    const [checkLogsSave] = await db.query(
      `SELECT * FROM logs_employer_save_jobseeker WHERE employer_id = ? and jobseeker_id = ?`,
      [employer_id, jobseeker_id]
    );
    const isSaved = checkLogsSave.length > 0 ? true : false;

    if (checkLogsView.length > 0) {
      console.log("update view");
      const [logs] = await db.query(
        `
                  UPDATE logs_employer_view_jobseeker set create_at =? WHERE employer_id=? AND jobseeker_id=? ;
                  `,
        [create_at, employer_id, jobseeker_id]
      );

      if (logs.affectedRows === 0) {
        throw new Error("Failed to insert logs into database");
      }
    } else {
      const [logs] = await db.query(
        `
      INSERT INTO logs_employer_view_jobseeker (employer_id, jobseeker_id, create_at) VALUES (?, ?, ?)
      `,
        [employer_id, jobseeker_id, create_at]
      );
      if (logs.affectedRows === 0) {
        // throw new Error("Failed to insert logs into database");
        return null;
      }
    }
    // THÊM NOTIFICATION CHO JOBSEEKER
    const [id] = await db.query(
      `INSERT INTO notification (recipient_id, notification_type, entity_id, content,created_at) VALUES (?, ?, ?, ?,?)`,
    [jobseeker_id, "employer_view_jobseeker", employer_id, `Bạn vừa được nhà tuyển dụng xem hồ sơ`,create_at]
    );
    if (!id.insertId)
      // throw new Error("Failed to insert notification into database");
      return null;
    await connection.commit(); // Cam kết giao dịch
    return {
      ...jobseeker_detail[0],
      ratingData,
      score: ratingData.averageScore,
      isSaved: isSaved,
    };
  } catch (error) {
    // Chỉ rollback khi connection đã được khởi tạo
    if (connection) {
      await connection.rollback();
    }
    console.error("Error getting jobseeker detail:", error);
    // throw error;
    return null;
  } finally {
    // Chỉ release khi connection đã được khởi tạo
    if (connection) {
      connection.release();
    }
  }
};

// Job Queries
const queryGetListJobByUser = async (employer_id) => {
  try {
    const [listJob] = await db.query(
      ` SELECT 
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
    j.status_,
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
      (select * from job where employer_id =?) as j
  JOIN
      company c ON j.employer_id = c.company_id
  LEFT JOIN
      catalog_industry ci ON j.industry_id = ci.industry_id
  LEFT JOIN
      catalog_job_function func ON j.job_function_id = func.job_function_id
  LEFT JOIN
      catalog_city loc ON j.work_location = loc.city_id    
  LEFT JOIN
      catalog_level lvl ON j.level_id = lvl.level_id
  LEFT JOIN
      catalog_education edu ON j.require_education = edu.education_id;
      `,
      [employer_id]
    );
    return listJob;
  } catch (error) {
    console.error("Error getting list job by user:", error);
    throw error; // Ném lại lỗi để xử lý ở nơi gọi hàm
  }
};

const queryGetListJobForInvite = async (employer_id, jobseeker_id) => {
  try {
    const [listJob] = await db.query(
      ` SELECT COALESCE(
  JSON_ARRAYAGG(
    JSON_OBJECT(
      'job_id', j.job_id,
      'title', j.title,  
      'date_post', j.date_post,
      'date_expi', j.date_expi,  
      'work_location_name', loc.city_name,
      'isInvited', CASE WHEN lei.job_id IS NOT NULL THEN TRUE ELSE FALSE END
    )
  ), JSON_ARRAY()) AS list_job
        
FROM
  (SELECT * FROM job WHERE employer_id = ? AND status_ = 1 AND date_expi > NOW()) AS j    
 LEFT  JOIN catalog_city loc ON j.work_location = loc.city_id
  LEFT JOIN logs_employer_invitation lei ON j.job_id = lei.job_id AND lei.jobseeker_id = ?;
      `,
      [employer_id, jobseeker_id]
    );
    return listJob[0].list_job;
  } catch (error) {
    console.error("Error getting list job by user:", error);
    throw error; // Ném lại lỗi để xử lý ở nơi gọi hàm
  }
};

const queryGetJobDetailByUser = async (job_id, employer_id) => {
  try {
    const [Job] = await db.query(
      ` SELECT 
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
    j.status_,
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
      (select * from job where job_id=? and employer_id =? ) as j
  JOIN
      company c ON j.employer_id = c.company_id
  LEFT JOIN
      catalog_industry ci ON j.industry_id = ci.industry_id
  LEFT JOIN
      catalog_job_function func ON j.job_function_id = func.job_function_id
  LEFT JOIN
      catalog_city loc ON j.work_location = loc.city_id    
  LEFT JOIN
      catalog_level lvl ON j.level_id = lvl.level_id
  LEFT JOIN
      catalog_education edu ON j.require_education = edu.education_id;
      `,
      [ job_id, employer_id]
    );
    return Job;
  } catch (error) {
    console.error("Error getting list job by user:", error);
    throw error; // Ném lại lỗi để xử lý ở nơi gọi hàm
  }
};

const queryAddJobByUser = async (data) => {
  let connection;
  if (
    typeof data !== "object" ||
    !data.employer_id ||
    !data.title ||
    !data.industry_id ||
    !data.job_function_id ||
    !data.describle ||
    !data.quantity
  ) {
    throw new Error("Missing required job information");
  }
  // Xử lý ngày tháng
  try {
    const employer_id = data.employer_id;
    const date_post_formatted = new Date(data.date_post || Date.now());
    const lastUpdatedOn = new Date();
    const date_expi = new Date(date_post_formatted);
    date_expi.setDate(date_expi.getDate() + 30); // 30 ngày sau ngày đăng
    data = {
      ...data,
      date_expi: date_expi,
      views: 0,
      lastUpdatedOn: lastUpdatedOn,
      date_post: date_post_formatted,
    };
    connection = await db.getConnection();
    await connection.beginTransaction();

    // Thêm thông tin job chính
    const availableFields = table_for_job.job.addItem.filter(
      (field) => data[field] !== undefined && data[field] !== null
    );
    let sql = `INSERT INTO job`;
    const fieldNames = availableFields.join(", ");
    sql += ` (${fieldNames}) VALUES (`;
    sql += availableFields.map(() => "?").join(", ") + ")";
    const values = availableFields.map((field) => data[field]);
    const [result] = await connection.query(sql, values);
    const job_id = result.insertId;

    console.log("job_id", job_id);
    if (!job_id) {
      throw new Error("Failed to insert job into database");
    }

    const { require_certification, require_language, require_skill } = data;
    // Xử lý chứng chỉ yêu cầu

    if (
      Array.isArray(require_certification) &&
      require_certification.length > 0
    ) {
      for (const cert of require_certification) {
        const [result] = await connection.query(
          `INSERT INTO job_require_certification (job_id, certification) VALUES (?,?)`,
          [job_id, cert]
        );
        if (result.affectedRows === 0) {
          throw new Error("Failed to insert certification into database");
        }
      }
    }

    // Xử lý ngôn ngữ yêu cầu
    if (Array.isArray(require_language) && require_language.length > 0) {
      for (const language_id of require_language) {
        const [result] = await connection.query(
          `INSERT INTO job_require_language (job_id, language_id) VALUES (?,?)`,
          [job_id, language_id]
        );
        if (result.affectedRows === 0) {
          throw new Error("Failed to insert education into database");
        }
      }
    }
    // Xử lý kỹ năng yêu cầu

    if (Array.isArray(require_skill) && require_skill.length > 0) {
      for (const skill_id of require_skill) {
        const [result] = await connection.query(
          `INSERT INTO job_require_skill (job_id, skill_id) VALUES (?,?)`,
          [job_id, skill_id]
        );
        if (result.affectedRows === 0) {
          throw new Error("Failed to insert skill into database");
        }
      }
    }

    await connection.commit();
    return job_id;
  } catch (error) {
    // Chỉ rollback khi connection đã được khởi tạo
    if (connection) {
      await connection.rollback();
    }
    console.error("Error adding job:", error);
    throw error;
  } finally {
    // Chỉ release khi connection đã được khởi tạo
    if (connection) {
      connection.release();
    }
  }
};

const queryUpdateJobByUser = async (data) => {
  let connection;
  const { job_id, employer_id } = data;
  if (!job_id || !employer_id) {
    throw new Error("Missing job_id or employer_id");
  }
  try {
    const lastUpdateOn = new Date();
    data = { ...data, lastUpdateOn: lastUpdateOn };
    console.log("data", data);
    connection = await db.getConnection();
    await connection.beginTransaction();

    // Thêm thông tin job chính
    const availableFields = table_for_job.job.updateItem.filter(
      (field) => data[field] !== undefined && data[field] !== null
    );
    const fieldNames = availableFields.join(", ");
    let sql = `UPDATE job SET `;
    sql += availableFields.map((field) => `${field} = ?`).join(", ");
    sql += ` WHERE job_id = ? AND employer_id = ?;`;
    const values = availableFields.map((field) => data[field]);
    values.push(job_id, employer_id);
    console.log("sql", sql);
    console.log("values", values);
    const [result] = await connection.query(sql, values);
    if (result.affectedRows === 0) {
      throw new Error("Failed to insert job into database");
    }

    const { require_certification, require_language, require_skill } = data;
    // Xử lý chứng chỉ yêu cầu

    if (
      Array.isArray(require_certification) &&
      require_certification.length > 0
    ) {
      const [delete_result] = await connection.query(
        `DELETE FROM job_require_certification WHERE job_id = ?`,
        [job_id]
      );

      for (const cert of require_certification) {
        const [result] = await connection.query(
          `INSERT INTO job_require_certification (job_id, certification) VALUES (?,?)`,
          [job_id, cert]
        );
        if (result.affectedRows === 0) {
          throw new Error("Failed to insert certification into database");
        }
      }
    }

    // Xử lý ngôn ngữ yêu cầu
    if (Array.isArray(require_language) && require_language.length > 0) {
      const [delete_result] = await connection.query(
        `DELETE FROM job_require_language WHERE job_id = ?`,
        [job_id]
      );
      for (const language_id of require_language) {
        const [result] = await connection.query(
          `INSERT INTO job_require_language (job_id, language_id) VALUES (?,?)`,
          [job_id, language_id]
        );
        if (result.affectedRows === 0) {
          throw new Error("Failed to insert education into database");
        }
      }
    }
    // Xử lý kỹ năng yêu cầu

    if (Array.isArray(require_skill) && require_skill.length > 0) {
      const [delete_result] = await connection.query(
        `DELETE FROM job_require_skill WHERE job_id = ?`,
        [job_id]
      );

      for (const skill_id of require_skill) {
        const [result] = await connection.query(
          `INSERT INTO job_require_skill (job_id, skill_id) VALUES (?,?)`,
          [job_id, skill_id]
        );
        if (result.affectedRows === 0) {
          throw new Error("Failed to insert skill into database");
        }
      }
    }
    await connection.commit();
    return true;
  } catch (error) {
    // Chỉ rollback khi connection đã được khởi tạo
    if (connection) {
      await connection.rollback();
    }
    console.error("Error adding job:", error);
    throw error;
  } finally {
    // Chỉ release khi connection đã được khởi tạo
    if (connection) {
      connection.release();
    }
  }
};

const queryDeleteJobByUser = async (employer_id, job_id) => {
  try {
    const [deleteResult] = await db.query(
      `DELETE FROM job WHERE job_id = ? AND employer_id = ?`,
      [job_id, employer_id]
    );
    if (deleteResult.affectedRows === 0) {
      throw new Error("No job found with the given job_id and employer_id");
    }
    return true; // Trả về true nếu xóa thành công
  } catch (error) {
    console.error("Error deleting job:", error);
    throw error; // Ném lại lỗi để xử lý ở nơi gọi hàm
  }
};

// Company Queries
const queryGetCompanyInformation = async (company_id) => {
  try {
    const [companyInfo] = await db.query(
      `SELECT 
      c.company_id,
      c.company_name,
      c.logo,
      u.email,
      u.phone_number,
      c.background,
      ue.status_,
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
                  'location_id', cl.location_id,
                  'city_id', cl.city_id,
                  'city_name', ct.city_name,
                  'address', cl.address))
          , JSON_ARRAY())
        FROM
          (select * FROM company_location where company_location.company_id = c.company_id) as cl
          JOIN catalog_city ct ON ct.city_id = cl.city_id) as company_location
        FROM 
          (select * from company WHERE company_id = ?) as c
        join 
        (select * from user_employer where employer_id = ?) as ue
        JOIN 
        (select * from user_ where user_.user_id = ?) as u ON u.user_id = ue.employer_id
        LEFT JOIN catalog_industry ci ON ci.industry_id = c.industry_id
        LEFT JOIN catalog_scale cs ON cs.scale_id = c.scale_id;  `,
      [company_id, company_id,company_id]
    );
    return companyInfo[0];
  } catch (error) {
    console.error("Error getting company information:", error);
    throw error; // Ném lại lỗi để xử lý ở nơi gọi hàm
  }
};

const queryAddItemCompanyProfile = async (type, data) => {
  try {
    if (type === "company_location") {
      const { company_id, city_id, address = "" } = data;
      // console.log(company_id, city_id, address);
      const [result] = await db.query(
        `INSERT INTO company_location (company_id, city_id, address) VALUES (?, ?, ?);`,
        [company_id, city_id, address]
      );
      // console.log("result", result);
      return result.affectedRows > 0; // Trả về true nếu có hàng bị xóa
    } else if (type === "company_benefit") {
      const { company_id, benefit_id, benefit_value = "" } = data;
      const [result] = await db.query(
        `INSERT INTO company_benefit (company_id, benefit_id, benefit_value) VALUES (?, ?, ?);`,
        [company_id, benefit_id, benefit_value]
      );
      // console.log("result", result);
      return result.affectedRows > 0; // Trả về true nếu có hàng bị xóa
    }
    return false;
  } catch (error) {
    console.error("Error Add company information:", error);
    throw error; // Ném lại lỗi để xử lý ở nơi gọi hàm
  }
};

const queryUpdateItemCompanyProfile = async (type, data) => {
  try {
    if (type === "Basic") {
      const availableFields = EmployerTables.company.updateItem.filter(
        (field) => data[field] !== undefined && data[field] !== null
      );
      let sql = `UPDATE company SET `;
      sql += availableFields.map((field) => `${field} = ?`).join(", ");
      sql += ` WHERE company_id = ?;`;
      const values = availableFields.map((field) => data[field]);
      values.push(data.company_id);
      // console.log("sql", sql);
      // console.log("values", values);
      const [result] = await db.query(sql, values);
      return result.affectedRows > 0; //
    } else if (type === "company_location") {
      const { location_id, company_id, city_id, address = "" } = data;
      const [result] = await db.query(
        `Update company_location SET city_id =?, address =? where  company_id = ? and location_id = ?;`,
        [city_id, address, company_id, location_id]
      );
      return result.affectedRows > 0;
    } else if (type === "company_benefit") {
      const { company_id, benefit_id, benefit_value = "" } = data;
      const [result] = await db.query(
        `Update company_benefit SET benefit_value =? where company_id = ?  and benefit_id = ?;`,
        [benefit_value, company_id, benefit_id]
      );
      return result.affectedRows > 0; // Trả về true nếu có hàng bị xóa
    }
    return false;
  } catch (error) {
    console.error("Error Update company information:", error);
    throw error; // Ném lại lỗi để xử lý ở nơi gọi hàm
  }
};

const queryDeleteItemCompanyProfile = async (type, company_id, id) => {
  // console.log(type, company_id, id);
  try {
    if (type === "company_location") {
      const [result] = await db.query(
        `delete from company_location where company_id = ? and location_id =?;`,
        [company_id, id]
      );
      // console.log("result", result);
      return result.affectedRows > 0; // Trả về true nếu có hàng bị xóa
    } else if (type === "company_benefit") {
      const [result] = await db.query(
        `delete from company_benefit where company_id=? and benefit_id = ?;`,
        [company_id, id]
      );

      return result.affectedRows > 0; // Trả về true nếu có hàng bị xóa
    }
    return false;
  } catch (error) {
    console.error("Error Delete company information:", error);
    throw error; // Ném lại lỗi để xử lý ở nơi gọi hàm
  }
};

// Update logo image URL in the company profile
const queryUpdateLogoImage = async (company_id, logoUrl) => {
  try {
    console.log("Updating logo image for company:", company_id);
    const [result] = await db.query(
      `UPDATE company SET logo = ? WHERE company_id = ?;`,
      [logoUrl, company_id]
    );
    return result.affectedRows > 0; // Return true if update was successful
  } catch (error) {
    console.error("Error updating logo image:", error);
    throw error;
  }
};

// Update background image URL in the company profile
const queryUpdateBackgroundImage = async (company_id, bgUrl) => {
  try {
    console.log("Updating background image for company:", company_id);
    const [result] = await db.query(
      `UPDATE company SET background = ? WHERE company_id = ?;`,
      [bgUrl, company_id]
    );
    return result.affectedRows > 0; // Return true if update was successful
  } catch (error) {
    console.error("Error updating background image:", error);
    throw error;
  }
};

// Candidate Queries
const queryGetListCandidateSaving = async (employer_id) => {
  try {
    const [listCandidate] = await db.query(
      `select 
        (select avatar from user_jobseeker us where us.jobseeker_id = pj.profile_id) as avatar,
        pj.profile_id,
        pj.full_name,
        pj.year_exp,
        pj.title,
        pj.birthday,
        u.email,
        u.phone_number,
        log.create_at,
        COALESCE((Select lrj.score from logs_employer_rate_jobseeker lrj where lrj.jobseeker_id = pj.profile_id and lrj.employer_id = log.employer_id),0) as score,
        COALESCE((Select lrj.content from logs_employer_rate_jobseeker lrj where lrj.jobseeker_id = pj.profile_id and lrj.employer_id = log.employer_id),'') as content
       from  
       (SELECT * from logs_employer_save_jobseeker where employer_id = ?) log
      JOIN profile_jobseeker pj on log.jobseeker_id = pj.profile_id
      JOIN user_ u on u.user_id = pj.profile_id;
      `,
      [employer_id]
    );
    return listCandidate;
  } catch (error) {
    console.error("Error getting list candidate:", error);
    throw error; // Ném lại lỗi để xử lý ở nơi gọi hàm
  }
};

const querySaveCandidate = async (employer_id, jobseeker_id) => {
  try {
    const create_at = new Date();
    const [result] = await db.query(
      `INSERT INTO logs_employer_save_jobseeker (employer_id, jobseeker_id,create_at) VALUES (?, ?,?);`,
      [employer_id, jobseeker_id, create_at]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error saving candidate:", error);
    throw error; // Ném lại lỗi để xử lý ở nơi gọi hàm
  }
};

const queryRateCandidate = async (
  type,
  application_id,
  employer_id,
  rating,
  content
) => {
  try {
    const create_at = new Date();
    if (type === "update") {
      const [result] = await db.query(
        `UPDATE logs_employer_rate_jobseeker SET score = ?, content = ?, create_at = ? WHERE employer_id = ? AND jobseeker_id = ?;`,
        [rating, content, create_at, employer_id, application_id]
      );
      return result.affectedRows > 0;
    } else if (type === "insert") {
      const [result] = await db.query(
        `INSERT INTO logs_employer_rate_jobseeker (employer_id, jobseeker_id, score, content,create_at) VALUES (?, ?,?,?,?);`,
        [employer_id, application_id, rating, content, create_at]
      );
      // console.log("result", result);
      return result.affectedRows > 0;
    }
    return false;
  } catch (error) {
    console.error("Error saving candidate:", error);
    throw error; // Ném lại lỗi để xử lý ở nơi gọi hàm
  }
};

const queryDeleteCandidate = async (employer_id, jobseeker_id) => {
  try {
    const [result] = await db.query(
      `
        DELETE FROM logs_employer_save_jobseeker WHERE employer_id = ? AND jobseeker_id = ?;
      `,
      [employer_id, jobseeker_id]
    );
    return result.affectedRows > 0; // Trả về true nếu có hàng bị xóa
  } catch (error) {
    console.error("Error deleting candidate:", error);
    throw error; // Ném lại lỗi để xử lý ở nơi gọi hàm
  }
};

const queryInviteJobseekerApply = async (employer_id, jobseeker_id, job_ids) => {
  try {
    const create_at = new Date();
    for (const job_id of job_ids) {
      // xóa các reject ứng viên nếu có trước đó
      await db.query(
        `Update logs_jobseeker_apply_job set isreject=0 WHERE jobseeker_id = ? AND job_id = ?;`,
        [jobseeker_id, job_id]
      );
      const [result] = await db.query(
        `INSERT INTO logs_employer_invitation (employer_id, jobseeker_id, job_id, create_at) VALUES (?, ?, ?, ?);`,
        [employer_id, jobseeker_id, job_id, create_at]
      );
      const [result2] = await db.query(
        `INSERT INTO notification (recipient_id, notification_type, entity_id,content,is_read, created_at) VALUES (?, ?, ?, ?,?,?);`,
        [jobseeker_id,"invitation",employer_id,"Bạn vừa được nhà tuyển dụng mời ứng tuyển",0, create_at]
      );
      // console.log("result", result);
      if (result.affectedRows === 0 || result2.affectedRows === 0) {
        throw new Error("Failed to insert invite into database");
      }
    }
    return true; // Trả về true ok
  } catch (error) {
    console.error("Error saving candidate:", error);
    throw error; // Ném lại lỗi để xử lý ở nơi gọi hàm
  }
};
const queryDeleteInvitation = async (employer_id, jobseeker_id, job_id) => {
  try {
    const [result] = await db.query(
      `
        DELETE FROM logs_employer_invitation WHERE employer_id = ? AND jobseeker_id = ? AND job_id = ?;
      `,
      [employer_id, jobseeker_id, job_id]
    );
    return result.affectedRows > 0; // Trả về true nếu có hàng bị xóa
  } catch (error) {
    console.error("Error deleting candidate:", error);
    throw error; // Ném lại lỗi để xử lý ở nơi gọi hàm
  }
};
const queryGetListInvitaion = async (employer_id) => {
  try {
    const [result] = await db.query(
      `Select 
          uj.avatar,
          p.profile_id,
          p.full_name,
          j.job_id,
          j.title,
          j.date_expi,
          j.date_post,
          p.birthday,
          COALESCE((Select lrj.score from logs_employer_rate_jobseeker lrj where lrj.jobseeker_id = p.profile_id and lrj.employer_id = lei.employer_id),0) as score,
          COALESCE((Select lrj.content from logs_employer_rate_jobseeker lrj where lrj.jobseeker_id = p.profile_id and lrj.employer_id = lei.employer_id),'') as content,
          lei.create_at 
        from logs_employer_invitation lei 
              JOIN job j on lei.job_id = j.job_id
              JOIN user_ u on lei.jobseeker_id = u.user_id
              JOIN user_jobseeker uj on uj.jobseeker_id = u.user_id
              JOIN profile_jobseeker p on lei.jobseeker_id = p.profile_id
              where lei.employer_id = ?;`, [employer_id]
    );
    return result;
  } catch (error) {
    console.error("Error Get Invitation candidate:", error);
    throw error; // Ném lại lỗi để xử lý ở nơi gọi hàm
  }
};
// Application Queries
const queryGetListJobApplication = async (employer_id) => {
  try {
    const [result] =  await db.query(
    ` SELECT 
        ljaj.job_id,
        p.profile_id,
        p.full_name,
        p.birthday,
        j.title,
        p.year_exp,
        u.email,
        e.avatar,
        ljaj.create_at,
        ljaj.isreject,
        e.is_open_for_job,
        COALESCE((Select lrj.score from logs_employer_rate_jobseeker lrj where lrj.jobseeker_id = p.profile_id and lrj.employer_id = j.employer_id),0) as score,
        COALESCE((Select lrj.content from logs_employer_rate_jobseeker lrj where lrj.jobseeker_id = p.profile_id and lrj.employer_id = j.employer_id),'') as content,
        COUNT(*) OVER() AS total_count
      FROM 
          (select * from job where employer_id = ?) AS j
      JOIN
          logs_jobseeker_apply_job ljaj on ljaj.job_id = j.job_id
      JOIN
        user_ u on u.user_id = ljaj.jobseeker_id 
      JOIN 
          user_jobseeker AS e ON e.jobseeker_id = ljaj.jobseeker_id 
      JOIN
          profile_jobseeker AS p ON ljaj.jobseeker_id = p.profile_id
      where ljaj.isreject=0;`,[employer_id]);
      return result;

  } catch (error) {
    console.error("Error get candidate applied:", error);
    throw error; // Ném lại lỗi để xử lý ở nơi gọi hàm
  }
};
// const queryGetListJobApplicationByJob = async (employer_id, job_id) => {
//   try {

    
//   } catch (error) {
//     console.error("Error saving candidate:", error);
//     throw error; // Ném lại lỗi để xử lý ở nơi gọi hàm
//   }
// };

const queryRejectJobApplication = async (employer_id, job_id, jobseeker_id) => {
  try {
const [result] = await db.query(
    `UPDATE logs_jobseeker_apply_job SET isreject = 1 WHERE job_id = ? AND jobseeker_id = ?;`,
    [job_id, jobseeker_id]
  );
  if (result.affectedRows === 0) {
    throw new Error("Failed to update application status in database");
  }
  return true; // Trả về true nếu cập nhật thành công
  } catch (error) {
    console.error("Error saving candidate:", error);
    throw error; // Ném lại lỗi để xử lý ở nơi gọi hàm
  }
};

const queryAddNotification = async (employer_id, jobseeker_id, job_id) => {
  try {



    
  } catch (error) {
    console.error("Error saving candidate:", error);
    throw error; // Ném lại lỗi để xử lý ở nơi gọi hàm
  }
};

const queryGetOverview = async (employer_id, days) => {
  try {
    if (!Array.isArray(days) || days.length !== 5) {
      throw new Error(
        "Invalid days array. It should contain exactly 5 elements."
      );
    }
    const convertToDate = (dateStr) => {
      const parts = dateStr.split("/");
      if (parts.length !== 3)
        throw new Error(`Invalid date format: ${dateStr}`);
      // Chuyển từ DD/MM/YYYY sang YYYY-MM-DD
      return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    };
    const dateDays = days.map((day) => convertToDate(day));
    const [d1, d2, d3, d4, d5] = dateDays;

    const step = (d2 - d1) / (1000 * 60 * 60 * 24);
    const d0 = new Date(d1);
    d0.setDate(d0.getDate() - step);

    const [result0] = await db.query(
      `SELECT 
        JSON_ARRAY(
          COUNT(CASE WHEN create_at >= ? AND create_at < ? THEN 1 END) ,
          COUNT(CASE WHEN create_at >= ? AND create_at < ? THEN 1 END),
          COUNT(CASE WHEN create_at >= ? AND create_at < ? THEN 1 END),
          COUNT(CASE WHEN create_at >= ? AND create_at < ? THEN 1 END),
          COUNT(CASE WHEN create_at >= ? AND create_at < ? THEN 1 END)
        ) AS employer_invite_apply
      FROM logs_employer_invitation
      WHERE employer_id= ?`,
      [d0, d1, d0, d2, d0, d3, d0, d4, d0, d5, employer_id]
    );
    const [result1] = await db.query(
      `
        SELECT 
        JSON_ARRAY(
          COUNT(CASE WHEN create_at >= ? AND create_at < ? THEN 1 END) ,
          COUNT(CASE WHEN create_at >= ? AND create_at < ? THEN 1 END),
          COUNT(CASE WHEN create_at >= ? AND create_at < ? THEN 1 END),
          COUNT(CASE WHEN create_at >= ? AND create_at < ? THEN 1 END),
          COUNT(CASE WHEN create_at >= ? AND create_at < ? THEN 1 END)
          ) AS employer_rate_jobseeker
        FROM logs_employer_rate_jobseeker
        WHERE employer_id= ?;
      `,
      [d0, d1, d0, d2, d0, d3, d0, d4, d0, d5, employer_id]
    );
    const [result2] = await db.query(
      `
      SELECT 
          JSON_ARRAY(
          COUNT(CASE WHEN create_at >= ? AND create_at < ? THEN 1 END) ,
          COUNT(CASE WHEN create_at >= ? AND create_at < ? THEN 1 END),
          COUNT(CASE WHEN create_at >= ? AND create_at < ? THEN 1 END),
          COUNT(CASE WHEN create_at >= ? AND create_at < ? THEN 1 END),
          COUNT(CASE WHEN create_at >= ? AND create_at < ? THEN 1 END)
          ) AS employer_view_jobseeker
        FROM logs_employer_view_jobseeker
        WHERE employer_id= ?;
      `,
      [d0, d1, d0, d2, d0, d3, d0, d4, d0, d5, employer_id]
    );
    const [result3] = await db.query(
      `
        SELECT 
          JSON_ARRAY(
          COUNT(CASE WHEN ljaj.create_at >= ? AND ljaj.create_at < ? THEN 1 END) ,
          COUNT(CASE WHEN ljaj.create_at >= ? AND ljaj.create_at < ? THEN 1 END),
          COUNT(CASE WHEN ljaj.create_at >= ? AND ljaj.create_at < ? THEN 1 END),
          COUNT(CASE WHEN ljaj.create_at >= ? AND ljaj.create_at < ? THEN 1 END),
          COUNT(CASE WHEN ljaj.create_at >= ? AND ljaj.create_at < ? THEN 1 END)
          ) AS jobseeker_apply_job
        FROM logs_jobseeker_apply_job ljaj
        join job j on j.job_id = ljaj.job_id
        WHERE employer_id= ?;
      `,
      [d0, d1, d0, d2, d0, d3, d0, d4, d0, d5, employer_id]
    );
    const [result4] = await db.query(
      `
        SELECT 
          JSON_ARRAY(
          COUNT(CASE WHEN create_at >= ? AND create_at < ? THEN 1 END) ,
          COUNT(CASE WHEN create_at >= ? AND create_at < ? THEN 1 END),
          COUNT(CASE WHEN create_at >= ? AND create_at < ? THEN 1 END),
          COUNT(CASE WHEN create_at >= ? AND create_at < ? THEN 1 END),
          COUNT(CASE WHEN create_at >= ? AND create_at < ? THEN 1 END)
          ) AS jobseeker_follow_employer
        FROM logs_jobseeker_follow_employer
        WHERE employer_id= ?;
      `,
      [d0, d1, d0, d2, d0, d3, d0, d4, d0, d5, employer_id]
    );
    const [result5] = await db.query(
      `
        SELECT 
          JSON_ARRAY(
          COUNT(CASE WHEN ljsj.create_at >= ? AND ljsj.create_at < ? THEN 1 END) ,
          COUNT(CASE WHEN ljsj.create_at >= ? AND ljsj.create_at < ? THEN 1 END),
          COUNT(CASE WHEN ljsj.create_at >= ? AND ljsj.create_at < ? THEN 1 END),
          COUNT(CASE WHEN ljsj.create_at >= ? AND ljsj.create_at < ? THEN 1 END),
          COUNT(CASE WHEN ljsj.create_at >= ? AND ljsj.create_at < ? THEN 1 END)
          ) AS jobseeker_save_job
        FROM logs_jobseeker_save_job ljsj
        join job j on j.job_id = ljsj.job_id
        WHERE employer_id= ?;
      `,
      [d0, d1, d0, d2, d0, d3, d0, d4, d0, d5, employer_id]
    );
    const [result6] = await db.query(
      `
        SELECT 
          JSON_ARRAY(
          COUNT(CASE WHEN ljvj.create_at >= ? AND ljvj.create_at < ? THEN 1 END) ,
          COUNT(CASE WHEN ljvj.create_at >= ? AND ljvj.create_at < ? THEN 1 END),
          COUNT(CASE WHEN ljvj.create_at >= ? AND ljvj.create_at < ? THEN 1 END),
          COUNT(CASE WHEN ljvj.create_at >= ? AND ljvj.create_at < ? THEN 1 END),
          COUNT(CASE WHEN ljvj.create_at >= ? AND ljvj.create_at < ? THEN 1 END)
          ) AS jobseeker_view_job
        FROM logs_jobseeker_view_job ljvj
        join job j on j.job_id = ljvj.job_id
        WHERE employer_id= ?;
      `,
      [d0, d1, d0, d2, d0, d3, d0, d4, d0, d5, employer_id]
    );
    const [result7] = await db.query(
      `
          SELECT 
          JSON_ARRAY(
          COUNT(CASE WHEN create_at >= ? AND create_at < ? THEN 1 END) ,
          COUNT(CASE WHEN create_at >= ? AND create_at < ? THEN 1 END),
          COUNT(CASE WHEN create_at >= ? AND create_at < ? THEN 1 END),
          COUNT(CASE WHEN create_at >= ? AND create_at < ? THEN 1 END),
          COUNT(CASE WHEN create_at >= ? AND create_at < ? THEN 1 END)
          ) AS jobseeker_rate_company
        FROM logs_review
        WHERE company_id= ?;
      `,
      [d0, d1, d0, d2, d0, d3, d0, d4, d0, d5, employer_id]
    );
    const [TotalApply] = await db.query(
      `
        SELECT 
          COUNT(*) as TotalApply
        FROM job j
        join logs_jobseeker_apply_job lja on lja.job_id = j.job_id
        WHERE employer_id= ?;
      `,
      [employer_id]
    );
    const [NearlyExp] = await db.query(
      `
      SELECT 
          COUNT(*) AS NearlyExp
        FROM job
        WHERE employer_id= ? and DATEDIFF(CURDATE(), date_expi) <= 5;
      `,
      [d0, d1, d0, d2, d0, d3, d0, d4, d0, d5, employer_id]
    );
    const [TotalJob] = await db.query(
      `
      SELECT COUNT(*) AS TotalJob
      FROM job
      WHERE employer_id= ?;
      `,
      [employer_id]
    );
    const [VisibleJob] = await db.query(
      `
        SELECT COUNT(*) AS VisibleJob
        FROM job
        WHERE employer_id= ? and status_ = 1 and date_expi >= NOW();
        `,
      [employer_id]
    );
    const chart = {
      employer_invite_apply: result0[0].employer_invite_apply,
      employer_rate_jobseeker: result1[0].employer_rate_jobseeker,
      employer_view_jobseeker: result2[0].employer_view_jobseeker,
      jobseeker_apply_job: result3[0].jobseeker_apply_job,
      jobseeker_follow_employer: result4[0].jobseeker_follow_employer,
      jobseeker_save_job: result5[0].jobseeker_save_job,
      jobseeker_view_job: result6[0].jobseeker_view_job,
      jobseeker_rate_company: result7[0].jobseeker_rate_company,
    };
    return {
      chart,
      TotalApply: TotalApply[0].TotalApply,
      NearlyExp: NearlyExp[0].NearlyExp,
      TotalJob: TotalJob[0].TotalJob,
      VisibleJob: VisibleJob[0].VisibleJob,
    };
  } catch (error) {
    console.error("Error in queryGetOverview:", error);
    throw error;
  }
};

const queryGetNotification = async (employer_id) => {
try {
const [result] = await db.query(
  `SELECT 
  notification_id,
  notification_type,
  is_read,
  CASE  
        WHEN notification_type = 'review' THEN "Có lượt mới đánh giá công ty"
        WHEN notification_type = 'follow' THEN "Có lượt mới theo dõi công ty"
        WHEN notification_type = 'application' THEN "Có ứng viên mới ứng tuyển"
  END AS type_name,
  content,
  is_read,
  created_at,
  CASE  
        WHEN notification_type = 'review' THEN "Anonymous"
        ELSE p.full_name
  END AS entity_name,
  CASE  
        WHEN notification_type = 'review' THEN "Anonymous"
        ELSE notification.entity_id
  END AS entity_id,
  CASE  
        WHEN notification_type = 'review' THEN "Anonymous"
        ELSE uj.avatar
  END AS entity_logo
FROM notification 
LEFT JOIN user_jobseeker uj ON uj.jobseeker_id = notification.entity_id
LEFT JOIN profile_jobseeker p ON p.profile_id = notification.entity_id  
WHERE recipient_id = ? 
ORDER BY create_at DESC;`,[employer_id]
);
return result;


}
catch (error) {
  console.error("Error in queryGetNotification:", error);
  throw error;
};
};

const queryUpdateReadNotification = async (employer_id, notification_id) => {
  try {
    console.log(" queryUpdateReadNotification employer_id", employer_id);
    const [result] = await db.query(
      `UPDATE notification SET is_read = 1 WHERE recipient_id = ? AND notification_id = ?;`,
      [employer_id, notification_id]
    );
    return result.affectedRows > 0; // Trả về true nếu cập nhật thành công
  } catch (error) {
    console.error("Error updating notification:", error);
    throw error; // Ném lại lỗi để xử lý ở nơi gọi hàm
  }
}
 const queryChangePassword = async (employer_id, newPassword) => {
  try {
    const [result] = await db.query(
      `UPDATE user_ SET password_ = ? WHERE user_id = ?;`,
      [newPassword, employer_id]
    );
    return result.affectedRows > 0; // Trả về true nếu cập nhật thành công
  } catch (error) {
    console.error("Error updating password:", error);
    throw error; // Ném lại lỗi để xử lý ở nơi gọi hàm
  }
};
export {
  queryGetListJobseekerBySearch,
  queryGetJobseekerDetail,
  queryGetListJobByUser,
  queryGetJobDetailByUser,
  queryAddJobByUser,
  queryUpdateJobByUser,
  queryDeleteJobByUser,
  queryGetCompanyInformation,
  queryAddItemCompanyProfile,
  queryUpdateItemCompanyProfile,
  queryDeleteItemCompanyProfile,
  queryUpdateLogoImage,
  queryUpdateBackgroundImage,
  queryGetListCandidateSaving,
  querySaveCandidate,
  queryRateCandidate,
  queryDeleteCandidate,
  queryGetListJobApplication,
  queryRejectJobApplication,
  queryAddNotification,

  queryGetListJobForInvite,
  queryInviteJobseekerApply,
  queryGetListInvitaion,
  queryDeleteInvitation,
  // queryGetListJobApplicationByJob,

  queryGetOverview,
  queryGetNotification,
  queryUpdateReadNotification,

  queryChangePassword
};
