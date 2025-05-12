const db = require("../config/databaseConfig.js");
const profileTables = require("../config/table_for_jobseeker.js");
const { queryGetWorkDetail } = require("./employerModels.js");

const queryShowHideResume = async (profile_id, cv_id, type) => {
  try {
    if (type === "show") {
      const [result] = await db.query(
        `
        UPDATE profile_cv
        SET isactive = CASE
          WHEN cv_id = ? THEN 1
          ELSE 0
        END
        WHERE profile_id = ?;
        `,
        [cv_id, profile_id]
      );
      return result.affectedRows > 0;
    } else {
      const [result] = await db.query(
        `
        UPDATE profile_cv
        SET isactive = 0
        WHERE profile_id = ? AND cv_id = ?;
        `,
        [profile_id, cv_id]
      );
      return result.affectedRows > 0;
    }
  } catch (error) {
    console.error("Error show hide CV:", error);
    throw error;
  }
};
const queryJobseekerGetJobDetail = async (profile_id,job_id) => {
  let connection;
  const create_at = new Date();
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


    const [id_log] = await connection.query(
      "Insert into logs_jobseeker_view_job (jobseeker_id,job_id,create_at) VALUES (?,?,?)",
      [profile_id,job_id,create_at]
    );
    if (!id_log.insertId) {
      await connection.rollback(); // Rollback the transaction if the insert fails
      throw new Error("Failed to log job view");
    }

    // bo sung them notification tai day - neu can


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



const queryGetUserInformation = async (id) => {
  const [userInfor] = await db.query(
    `
    SELECT 
      js.avatar,
      u.user_id as profile_id,
      u.role_id as role,
      js.status_,
      u.username,
      u.email,
      u.phone_number,
      u.create_at,
      r.role_name,
      p.full_name,
      p.title,
      p.job_function_id,
      j.job_function_name,
      cle.level_name,
      p.career_target,
      p.salary_expect,
      p.year_exp,
      p.gender,
      p.birthday,
      p.marital_status,
      p.address,
      p.district_id,
      p.nationality_id,
      cna.nation_name,
      p.percent_complete,
      p.create_at as last_modify_date,
      c.city_name,
      c.city_id
    FROM 
      user_jobseeker js
    JOIN 
      user_ u ON js.jobseeker_id = u.user_id
    JOIN 
      catalog_role r ON u.role_id = r.role_id
    JOIN 
      profile_jobseeker p ON js.jobseeker_id = p.profile_id
    JOIN 
      catalog_job_function j ON j.job_function_id = p.job_function_id
    JOIN 
      catalog_city c ON p.city_id = c.city_id
    JOIN 
      catalog_level cle ON p.level_id= cle.level_id
	  join 
    catalog_nation cna ON cna.nation_id = p.nationality_id
    WHERE 
      u.user_id = ?;
    `,
    [id]
  );
  // console.log(userInfor);
  return userInfor[0];
};

const queryGetExperienceByID = async (id) => {
  const [experience] = await db.query(
    `
    SELECT 
      exp.*
    FROM 
      user_jobseeker js
    JOIN 
      user_ u ON js.jobseeker_id = u.user_id
    JOIN 
      profile_jobseeker p ON js.jobseeker_id = p.profile_id
    LEFT JOIN 
      profile_experience exp ON p.profile_id = exp.profile_id
    WHERE 
      u.user_id = ?;
    `,
    [id]
  );
  return experience;
};

const queryGetEducationByID = async (id) => {
  const [education] = await db.query(
    `
    SELECT 
      edu.*,
      c.education_title
    FROM
      user_jobseeker js
    JOIN
      user_ u ON js.jobseeker_id = u.user_id
    JOIN
      profile_jobseeker p ON js.jobseeker_id = p.profile_id
    LEFT JOIN
      profile_education edu ON p.profile_id = edu.profile_id
    JOIN 
      catalog_education c ON c.education_id = edu.education_id
    WHERE
      u.user_id = ?;
    `,
    [id]
  );
  return education;
};

const queryGetProjectByID = async (id) => {
  const [project] = await db.query(
    `
    SELECT 
      pro.*
    FROM
      user_jobseeker js
    JOIN
      user_ u ON js.jobseeker_id = u.user_id
    JOIN
      profile_jobseeker p ON js.jobseeker_id = p.profile_id
    LEFT JOIN
      profile_project pro ON p.profile_id = pro.profile_id
    WHERE
      u.user_id = ?;
    `,
    [id]
  );
  return project;
};

const queryGetSkillByID = async (id) => {
  const [skill] = await db.query(
    `
    SELECT 
      sk.* ,
      ct.tags_content
    FROM
      profile_skill sk
    LEFT JOIN
      catalog_tags ct ON sk.skill_id = ct.tag_id
    WHERE
      sk.profile_id = ?;
    `,
    [id]
  );
  if (skill.length > 0) {
    return skill;
  } else return null;
};

const queryGetLanguageByID = async (id) => {
  const [language] = await db.query(
    `
    SELECT
      lang.profile_id,
      cl.*
    FROM
      profile_language lang
    JOIN
      catalog_language cl ON lang.language_id = cl.language_id    
    WHERE
      lang.profile_id = ?;
    `,
    [id]
  );
  return language;
};

const queryGetCertificateByID = async (id) => {
  const [certificate] = await db.query(
    `
    SELECT 
      cer.*
    FROM
      user_jobseeker js
    JOIN
      profile_jobseeker p ON js.jobseeker_id = p.profile_id
    LEFT JOIN
      profile_certification cer ON p.profile_id = cer.profile_id
    WHERE
      js.jobseeker_id  = ?;
    `,
    [id]
  );
  return certificate;
};

const queryGetJobAppliedByID = async (id) => {
  try{
    const [jobApplied] = await db.query(
      `
    SELECT 
        ja.*
      FROM
        logs_jobseeker_apply_job ja
      WHERE
        ja.jobseeker_id  =   ?;
      `,
      [id]
    );
    return jobApplied;
  }
  catch (error) { 
    console.error("Error in queryGetJobAppliedByID:", error);
    throw error;
  }
};

const queryGetJobSavedByID = async (id) => {
  const [jobSaved] = await db.query(
    `
    SELECT 
      js.*
    FROM
      logs_jobseeker_save_job js
    WHERE
      js.jobseeker_id = ?;
    `,
    [id]
  );
  return jobSaved;
};

const queryGetFollowedCompanyByID = async (id) => {
  const [followedCompany] = await db.query(
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
    (SELECT AVG(lr.score) FROM logs_review lr WHERE lr.company_id = c.company_id) AS average_score
    FROM
      (select employer_id from logs_jobseeker_follow_employer WHERE  jobseeker_id = ?) as main_table
    JOIN
      (select * from company
        join user_employer e on company.company_id = e.employer_id
        WHERE e.status_ = 1) as c ON main_table.employer_id = c.company_id
    JOIN catalog_industry ci ON c.industry_id = ci.industry_id
    JOIN catalog_scale cs on cs.scale_id = c.scale_id    
    ORDER BY count_job_posted DESC, count_follower DESC, average_score DESC;
    `,
    [id]
  );
  // console.log(followedCompany);
  return followedCompany;
};

const queryGetBasicCompany = async (id) => {
  const [result] = await db.query(
    `SELECT * FROM (Select * FROM company where company_id = ?) as t1
    JOIN catalog_scale cs on cs.scale_id= t1.scale_id  JOIN company_location cl ON cl.company_id = t1.company_id 
    JOIN catalog_industry ci where ci.industry_id=t1.industry_id`,
    [id]
  );
  return result;
};

const queryUpdateJobseekerProfileImage = async (id, url) => {
  const [affectedRows] = await db.query(
    `
    UPDATE user_jobseeker
      SET avatar = ?
    WHERE jobseeker_id = ?;

    `,
    [url, id]
  );
  return affectedRows;
};

const queryAddItemProfile = async (type, data) => {
  if (!profileTables['profile'][type] || profileTables['profile'][type].tableName === undefined || profileTables['profile'][type].key === "Basic") {
    throw new Error(`Invalid profile type: ${type}`);
  }
  // console.log("data Add ",type);
try {
  if (type==="language" || type==="skill") { // array of objects
    const profile_id = data.profile_id;
    const arr = data.values;    
    const fieldsArray = profileTables['profile'][type]["addItem"];    
    const values = [];
    const placeholder_arr=[];
    arr.forEach(item => { 
      values.push(profile_id, item);
      placeholder_arr.push(`(${fieldsArray.map(() => "?").join(", ")})`);
    }
    );
    const fields = fieldsArray.join(", ");
    const placeholders = placeholder_arr.join(", ");
    const [result] = await db.query(
      `
      INSERT INTO ${profileTables['profile'][type].tableName} (${fields})
      VALUES ${placeholders};`,
      values
    );
    return  result.affectedRows;}
  else {
    const fieldsArray = profileTables['profile'][type]["addItem"];    
    const values = [];
    // console.log("data Add ",data);
    fieldsArray.forEach(field => {
      if (data[field] !== undefined) {
        values.push(data[field]);
      } else {
        throw new Error(`Required field '${field}' is missing in the data for ${type}`)
      }
    });
    const fields = fieldsArray.join(", ");
    const placeholders = values.map(() => "?").join(", ");


    // console.log(      `
    //   INSERT INTO ${profileTables['profile'][type].tableName} (${fields})
    //   VALUES (${placeholders});`,
    //   values)
    const [result] = await db.query(
      `
      INSERT INTO ${profileTables['profile'][type].tableName} (${fields})
      VALUES (${placeholders});`,
        values
      );
      return result.affectedRows;
    }
  } catch (error) {
    console.error("Error in queryAddItemProfile:", error);
    throw error;
  }
};

const queryUpdateItemProfile = async (type, data) => {
  // data là dạng object như {title: "abc", profile_id: 1}
  try {
    if (type === "Basic") {
      // Special case for Basic profile fields
      const key = profileTables['profile'][type]["key"][0]; // bang nay chi co 1 key
      // console.log("data Update Basic ",data);
      const fieldsToUpdate_arr = [];
      const values = [];
      Object.keys(data).forEach((item) => {
        if (profileTables['profile'][type]["updateItem"].includes(item)) {
          fieldsToUpdate_arr.push(`${item}=?`);
          values.push(data[item]);
        }
      });
      const fieldsToUpdate = fieldsToUpdate_arr.join(", ");
      // console.log("fieldsToUpdate_arr", fieldsToUpdate);
      values.push(data[key]);
      const [result] = await db.query(
        `
        UPDATE profile_jobseeker
        SET ${fieldsToUpdate}
        WHERE ${key} = ?;`,
        values
      );
      return result.affectedRows;
    } else {
      // console.log("data Update other ",data);
      if (!profileTables['profile'][type]) {
        throw new Error(`Invalid profile type: ${type}`);
      }
      const values = [];
      const fieldsToUpdate = profileTables['profile'][type]["updateItem"];   
      const fields = fieldsToUpdate.map((item) => `${item} = ?`).join(", ");
      const fieldKey = profileTables['profile'][type]["key"];
      const whereClause = fieldKey.map((item) => `${item} = ?`).join(" AND ");
      fieldsToUpdate.map((item) => values.push(data[item]));
      fieldKey.map((item) => values.push(data[item]));
      const [result] = await db.query(
        `
        UPDATE ${profileTables['profile'][type].tableName}
        SET ${fields}
        WHERE ${whereClause};`,
        values
      );
      return result.affectedRows;
    }
  } catch (error) {
    console.error("Error in queryUpdateItemProfile:", error);
    throw error;
  }
};

const queryDeleteItemProfile = async (type, data) => {
  try {

    if (!profileTables['profile'][type]) {
      throw new Error(`Invalid profile type: ${type}`);
    }
    const values = [];
    const fieldsToDelete = profileTables['profile'][type]["key"]; 
    const whereClause = fieldsToDelete.map((item) => `${item} = ?`).join(" AND ");
    fieldsToDelete.map((item) => values.push(data[item]));
    const [result] = await db.query(
      `
    DELETE FROM ${profileTables['profile'][type].tableName}
    WHERE ${whereClause};`,
      values
    );
    // console.log(result);
    // console.log(result.affectedRows);
    return result.affectedRows>0;
  } catch (error) {
    console.error(`Error in queryDeleteItemProfile:`, error);
    throw error;
  }
};

const queryGetItemProfile = async (type, profile_id) => {
  try {
    if (type === "Basic") {
      // Special case for Basic profile fields
      const result = queryGetUserInformation(profile_id);
      return result;
    } else {
      if (!profileTables['profile'][type]) {
        throw new Error(`Invalid profile type: ${type}`);
      }
      switch (type) {
        case "experience":
          const exp = await queryGetExperienceByID(profile_id);
          return exp;
        case "education":
          const edu = await queryGetEducationByID(profile_id);
          return edu;
        case "project":
          const project = await queryGetProjectByID(profile_id);
          return project;
        case "skill":
          const skill = await queryGetSkillByID(profile_id);
          return skill;
        case "language":
          const lang = await queryGetLanguageByID(profile_id);
          return lang;
        case "certification":
          const cert = await queryGetCertificateByID(profile_id);
          return cert;
        case "cv":
          const cv = await queryGetCertificateByID(profile_id);
          return cv;
        case "apply_job":
          const jobApplied_basic = await queryGetJobAppliedByID(profile_id);
          const jobApplied = [];
          for (const item of jobApplied_basic) {
            const [job] = await queryGetWorkDetail(item.job_id);
            jobApplied.push(job);
          }
          return jobApplied;
        case "save_job":
          const jobSaved_basic = await queryGetJobSavedByID(profile_id);
          const jobSaved = [];
          for (const item of jobSaved_basic) {
            const [job] = await queryGetWorkDetail(item.job_id);
            jobSaved.push(job);
          }
          // console.log(jobSaved);
          return jobSaved;
        case "follow_employer":
          const followedCompany_basic = await queryGetFollowedCompanyByID(
            profile_id
          );
          const followedCompany = [];
          // if (!followedCompany_basic) return followedCompany;
          for (const item of followedCompany_basic) {
            // console.log(item);
            const [company] = await queryGetBasicCompany(item.employer_id);
            followedCompany.push(company);
          }
          return followedCompany;
        default:
          throw new Error(`Invalid profile type: ${type}`);
      }
      // return result.affectedRows;;
    }
  } catch (error) {
    console.error("Error in queryUpdateItemProfile:", error);
    throw error;
  }
};
/////////////////////////////////////////////////////////
// Profile related queries

// Resume related queries
const queryAddResume = async (profile_id, resumeData) => { 
  try {
    const { cv_name, cv_link, s3_key } = resumeData;
    const create_at = new Date();
    let isactive = 0; // Default to inactive (0), can be activated later
    const [count] = await db.query(
      `SELECT COUNT(*) as count FROM profile_cv WHERE profile_id = ?`,[profile_id]
    );
    if (count[0].count >= 0) { isactive=1;}    
    const [result] = await db.query(
      `INSERT INTO profile_cv (profile_id, cv_name, cv_link, s3_key, create_at, isactive) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [profile_id, cv_name, cv_link, s3_key, create_at, isactive]
    );
    
    return result.insertId;
  }
  catch (error) {
    console.error("Error in queryAddResume:", error);
    throw error;
  }

};

const queryGetResume = async (profile_id) => {
  try {
    const [resumes] = await db.query(
      `SELECT cv_id, cv_name, cv_link, s3_key, create_at, isactive
       FROM profile_cv
       WHERE profile_id = ?
       ORDER BY create_at DESC`,
      [profile_id]
    );
    
    return resumes;
  }
  catch (error) {
    console.error("Error in queryGetResume:", error);
    throw error;
  }

};

const queryDeleteResume = async (profile_id,cv_id) => {
  try 
  {
    const [result] = await db.query(
      `DELETE FROM profile_cv 
       WHERE cv_id = ? AND profile_id = ?`,
      [cv_id, profile_id]
    );
    
    return result.affectedRows > 0;
  }
  catch (error)
  {
    console.error("Error in queryDeleteResume:", error);
    throw error;
  }

};

// Job application related queries
const queryGetListJobApplication = async (profile_id) => {
  try {
    const [jobApplications] = await db.query(
      `
      SELECT 
      j.title,
      j.job_id,
      j.date_post,
      j.date_expi,
      cc.city_id,
      cc.city_name as work_location,
      j.salary_max,
      j.salary_min,
      j.industry_id,
      j.describle,
      ci.industry_name,
      j.job_function_id,
      cj.job_function_name,
      c.company_id,
      c.company_name,
      c.logo,
      c.background,
      1 as is_applied
      FROM
      (SELECT ja.*
       FROM logs_jobseeker_apply_job ja
       WHERE ja.jobseeker_id = ?) lja
       JOIN job j ON lja.job_id = j.job_id
       JOIN catalog_industry ci ON j.industry_id = ci.industry_id
       JOIN catalog_job_function cj ON j.job_function_id = cj.job_function_id
      JOIN company c ON j.employer_id = c.company_id
      JOIN catalog_city cc ON j.work_location = cc.city_id
      WHERE j.status_ = 1 and j.date_expi >= NOW();
       `,
      [profile_id]
    );
    if (jobApplications.length > 0) {
      return jobApplications;
    } else {
      return []; // No job applications found
    }
  }
  catch (error) {
    console.error("Error in queryGetListJobApplication:", error);
    throw error;
  }
};

const queryApplyToJob = async (profile_id, job_id) => {
  try {
    const create_at = new Date();
    const [result] = await db.query(
      `Insert INTO logs_jobseeker_apply_job (job_id, jobseeker_id, create_at)
      VALUES (?, ?, ?)`,
      [job_id, profile_id, create_at]
    );
    if (result.affectedRows > 0) {
      return true; // Application successful
    } else {
      return false; // Application failed
    }
  }
catch (error) {
    console.error("Error in queryApplyToJob:", error);
    throw error;
  }
};

// Company review and following
const queryAddCompanyReview = async ( profile_id, company_id,score,content) => {
  try{
    const [result] = await db.query(
      `INSERT INTO logs_review (jobseeker_id, company_id, score, content, create_at) 
       VALUES (?, ?, ?, ?, now())`,
      [profile_id, company_id, score, content]
    );
    // console.log(result);
    return result.affectedRows > 0;
  }
  catch (error) {
    console.error("Error in queryAddCompanyReview:", error);
    throw error;
  }
};

const queryGetListCompanyFollowing = async (profile_id) => {
  try{
    const [followedCompanies] = await db.query(
      `SELECT
        c.company_id, 
        c.company_name, 
        c.logo, 
        c.background,
        c.industry_id,
        ci.industry_name,
        (select count(*) from job j where j.employer_id = ljfe.employer_id and j.status_=1 and j.date_expi>=now()) as count_job_posted,
        ROUND(COALESCE((SELECT AVG(lr.score) FROM logs_review lr WHERE lr.company_id = c.company_id), 0), 1) AS average_score,
        ( SELECT COALESCE(
          JSON_ARRAYAGG(
              JSON_OBJECT(
                  'city_id', cl.city_id,
                  'city_name', ct.city_name,
                  'address', cl.address))
          , JSON_ARRAY())
        FROM
          (select * FROM company_location where company_location.company_id = c.company_id) as cl
          JOIN catalog_city ct ON ct.city_id = cl.city_id) as company_location
      FROM 
        (select * from logs_jobseeker_follow_employer lj where lj.jobseeker_id = ? ) ljfe
        JOIN company c on ljfe.employer_id = c.company_id 
        JOIN catalog_industry ci on c.industry_id = ci.industry_id`,
      [profile_id]);
      // console.log(followedCompanies);
      if (followedCompanies.length > 0) {
        return followedCompanies;
      } else {
        return [];} // No followed companies found
  }
  catch (error) {
    console.error("Error in queryGetListCompanyFollowing:", error);
    throw error;
  }
};

const queryDeleteCompanyFollowing = async (profile_id, company_id) => {
  try 
  {
    const [result] = await db.query(
      `DELETE FROM logs_jobseeker_follow_employer 
       WHERE jobseeker_id = ? AND employer_id = ?`,
      [profile_id, company_id]
    );
    return result.affectedRows > 0; // Return true if deletion was successful
  }
  catch (error) 
  {
    console.error("Error in queryDeleteCompanyFollowing:", error);
    throw error;
  }
};

const queryAddCompanyFollowing = async (profile_id, company_id) => {
  try {
    const create_at = new Date();
    const [result] = await db.query(
      `INSERT INTO logs_jobseeker_follow_employer (jobseeker_id, employer_id, create_at) 
       VALUES (?, ?, ?)`,
      [profile_id, company_id, create_at]);
    return result.affectedRows > 0;    
  }
  catch
  (error) {
      console.error("Error in queryAddCompanyFollowing:", error);
      throw error;
    }
};

// Job saving related queries
const queryGetListJobSaving = async (profile_id) => {
  try 
  {
    const [savedJobs] = await db.query(
      `SELECT 
      j.title,
      j.job_id,
      j.date_post,
      j.date_expi,
      cc.city_id,
      cc.city_name as work_location,
      j.salary_max,
      j.salary_min,
      j.industry_id,
      j.describle,
      ci.industry_name,
      j.job_function_id,
      cj.job_function_name,
      c.company_id,
      c.company_name,
      c.logo,
      c.background,
      1 as is_saved
    FROM
    (SELECT js.*
     FROM logs_jobseeker_save_job js
     WHERE js.jobseeker_id = ?) ljsj
     JOIN job j ON ljsj.job_id = j.job_id
     JOIN catalog_industry ci ON j.industry_id = ci.industry_id
     JOIN catalog_job_function cj ON j.job_function_id = cj.job_function_id
    JOIN company c ON j.employer_id = c.company_id
    JOIN catalog_city cc ON j.work_location = cc.city_id;`,
    [profile_id]
    );
    if (savedJobs.length > 0) {
      return savedJobs;
    }
    else return []; // No saved jobs found
  }
  catch (error) {
    console.error("Error in queryGetListJobSaving:", error);
    throw error;
  }
};

const queryAddJobSaving = async (profile_id,job_id) => {
  try 
  {
    const create_at = new Date();
    const [result] = await db.query(
      `INSERT INTO logs_jobseeker_save_job (job_id, jobseeker_id, create_at) 
       VALUES (?, ?, ?)`,
      [job_id, profile_id, create_at]
    );
    return result.affectedRows > 0;
  }
  catch (error) {
    console.error("Error in queryAddJobSaving:", error);
    throw error;
  }
};

const queryDeleteJobSaving = async (profile_id, job_id) => {
  try
  {
    const [result] = await db.query(
      `DELETE FROM logs_jobseeker_save_job 
       WHERE jobseeker_id = ? AND job_id = ?`,
      [profile_id, job_id]
    );
    // console.log(result);
    return result.affectedRows > 0; // Return true if deletion was successful
  }
  catch (error) {
    console.error("Error in queryDeleteJobSaving:", error);
    throw error;
  }
};

const queryGetOverview = async (profile_id, days) => {
  try {
    if (!Array.isArray(days) || days.length !== 5) {
      throw new Error("Invalid days array. It should contain exactly 5 elements.");
    }
    const convertToDate = (dateStr) => {
      const parts = dateStr.split('/');
      if (parts.length !== 3) throw new Error(`Invalid date format: ${dateStr}`);
      // Chuyển từ DD/MM/YYYY sang YYYY-MM-DD
      return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    };
    const dateDays = days.map(day => convertToDate(day));
    const [d1, d2, d3, d4, d5] = dateDays;

    const step = (d2 - d1) / (1000 * 60 * 60 * 24);
    const d0 = new Date(d1);
    d0.setDate(d0.getDate() - step);
    console.log("action overview");
    
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
      WHERE jobseeker_id = ?`,
      [d0, d1, d0, d2, d0, d3, d0, d4, d0, d5, profile_id]
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
        WHERE jobseeker_id = ?;
      `,
      [d0, d1, d0, d2, d0, d3, d0, d4, d0, d5, profile_id]
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
        WHERE jobseeker_id = ?;
      `,
      [d0, d1, d0, d2, d0, d3, d0, d4, d0, d5, profile_id]
    );
    const [result3] = await db.query(
      `
        SELECT 
          JSON_ARRAY(
          COUNT(CASE WHEN create_at >= ? AND create_at < ? THEN 1 END) ,
          COUNT(CASE WHEN create_at >= ? AND create_at < ? THEN 1 END),
          COUNT(CASE WHEN create_at >= ? AND create_at < ? THEN 1 END),
          COUNT(CASE WHEN create_at >= ? AND create_at < ? THEN 1 END),
          COUNT(CASE WHEN create_at >= ? AND create_at < ? THEN 1 END)
          ) AS jobseeker_apply_job
        FROM logs_jobseeker_apply_job
        WHERE jobseeker_id = ?;
      `,
      [d0, d1, d0, d2, d0, d3, d0, d4, d0, d5, profile_id]
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
        WHERE jobseeker_id = ?;
      `,
       [d0, d1, d0, d2, d0, d3, d0, d4, d0, d5, profile_id]
    );
    const [result5] = await db.query(
      `
        SELECT 
          JSON_ARRAY(
          COUNT(CASE WHEN create_at >= ? AND create_at < ? THEN 1 END) ,
          COUNT(CASE WHEN create_at >= ? AND create_at < ? THEN 1 END),
          COUNT(CASE WHEN create_at >= ? AND create_at < ? THEN 1 END),
          COUNT(CASE WHEN create_at >= ? AND create_at < ? THEN 1 END),
          COUNT(CASE WHEN create_at >= ? AND create_at < ? THEN 1 END)
          ) AS jobseeker_save_job
        FROM logs_jobseeker_save_job
        WHERE jobseeker_id = ?;
      `,
       [d0, d1, d0, d2, d0, d3, d0, d4, d0, d5, profile_id]
    );
    const [result6] = await db.query(
      `
        SELECT 
          JSON_ARRAY(
          COUNT(CASE WHEN create_at >= ? AND create_at < ? THEN 1 END) ,
          COUNT(CASE WHEN create_at >= ? AND create_at < ? THEN 1 END),
          COUNT(CASE WHEN create_at >= ? AND create_at < ? THEN 1 END),
          COUNT(CASE WHEN create_at >= ? AND create_at < ? THEN 1 END),
          COUNT(CASE WHEN create_at >= ? AND create_at < ? THEN 1 END)
          ) AS jobseeker_view_job
        FROM logs_jobseeker_view_job
        WHERE jobseeker_id = ?;
      `,
       [d0, d1, d0, d2, d0, d3, d0, d4, d0, d5, profile_id]
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
        WHERE jobseeker_id = ?;
      `,
       [d0, d1, d0, d2, d0, d3, d0, d4, d0, d5, profile_id]
    );
    // console.log(result7);
    const [totalApply] = await db.query(
      `
        SELECT 
          COUNT(*) AS total_apply_job
        FROM logs_jobseeker_apply_job
        WHERE jobseeker_id = ?;
      `,
      [ profile_id]
    );
    const [totalViews] = await db.query(
      `
      SELECT 
          COUNT(*) AS total_view_job
        FROM logs_employer_view_jobseeker
        WHERE jobseeker_id = ?;
      `,
      [d0, d1, d0, d2, d0, d3, d0, d4, d0, d5, profile_id]
    );
    const [totalSaved] = await db.query(
      `
      SELECT COUNT(*) AS total_save_job
      FROM logs_jobseeker_save_job
      WHERE jobseeker_id = ?;
      `,[profile_id]);
    const [percent_complete] = await db.query(
      `SELECT COALESCE((SELECT percent_complete FROM profile_jobseeker WHERE profile_id = ?),0) as percent_complete;`,
      [profile_id]);
    const chart  = 
      {
        'employer_invite_apply':result0[0].employer_invite_apply,   
        'employer_rate_jobseeker': result1[0].employer_rate_jobseeker,
        'employer_view_jobseeker': result2[0].employer_view_jobseeker,
        'jobseeker_apply_job': result3[0].jobseeker_apply_job,
        'jobseeker_follow_employer': result4[0].jobseeker_follow_employer,
        'jobseeker_save_job': result5[0].jobseeker_save_job,
        'jobseeker_view_job': result6[0].jobseeker_view_job,
        'jobseeker_rate_company': result7[0].jobseeker_rate_company
      }
    ;
    // console.log(result);
    return {chart, totalApply: totalApply[0].total_apply_job, totalViews: totalViews[0].total_view_job, totalSaved: totalSaved[0].total_save_job,percent_complete: percent_complete[0].percent_complete};
  } catch (error) {
    console.error("Error in queryGetOverview:", error);
    throw error;
  }
};

const queryGetJobsSuggestion = async (profile_id) => {
  try {
    const [userInfor] = await db.query(
      `SELECT 
      p.profile_id,
      p.job_function_id,
      p.city_id as work_location,
      p.salary_expect,
      p.title
      from profile_jobseeker p
      where p.profile_id = ?`,
      [profile_id]);

    const [result1] = await db.query(
      `SELECT 
        j.job_id,
        j.title,
        j.salary_min,
        j.salary_max,
        j.describle,
        c.company_name,
        c.logo as company_logo,
        j.date_post,
        j.date_expi,
        j.job_function_id,
        j.industry_id,
        j.work_location,
        (select city_name from catalog_city where city_id = j.work_location) as work_location_name
      FROM job j
      JOIN company c ON j.employer_id = c.company_id
      WHERE j.status_ = 1 AND j.date_expi >= NOW()
      and j.job_function_id = ?
      ORDER BY j.create_at DESC
      LIMIT 5;`,[userInfor[0].job_function_id]
    );
    const [result2] = await db.query(
      `SELECT 
        j.job_id,
        j.title,
        j.salary_min,
        j.salary_max,
        j.describle,
        c.company_name,
        c.logo as company_logo,
        j.date_post,
        j.date_expi,
        j.job_function_id,
        j.industry_id,
        j.work_location,
        (select city_name from catalog_city where city_id = j.work_location) as work_location_name
      FROM job j
      JOIN company c ON j.employer_id = c.company_id
      WHERE j.status_ = 1 AND j.date_expi >= NOW()
      and j.job_function_id = ?
      and j.salary_max >= ?
      ORDER BY j.create_at DESC
      LIMIT 5;`,[userInfor[0].job_function_id,userInfor[0].salary_expect]
    );
    const [result3] = await db.query(
      `SELECT 
        j.job_id,
        j.title,
        j.salary_min,
        j.salary_max,
        j.describle,
        c.company_name,
        c.logo as company_logo,
        j.date_post,
        j.date_expi,
        j.job_function_id,
        j.industry_id,
        j.work_location,
        (select city_name from catalog_city where city_id = j.work_location) as work_location_name
      FROM job j
      JOIN company c ON j.employer_id = c.company_id
      WHERE j.status_ = 1 AND j.date_expi >= NOW()  
      and j.title like ?
      ORDER BY j.create_at DESC
      LIMIT 5;`,[`%${userInfor[0].title}%`]
    );
    const data =  [...result1, ...result2, ...result3];
    const result = data.sort(() => 0.5 - Math.random()).slice(0, 5);
    return result;
  } catch (error) {
    console.error("Error in queryGetJobsSuggestion:", error);
    throw error;
  }
}



const queryGetNotification = async (jobseeker_id) => {
  try {
  const [result] = await db.query(
    `SELECT 
    notification_id,
    notification_type,
    is_read,
    CASE  
          WHEN notification_type = 'viewprofile' THEN "Có nhà tuyển dụng xem hồ sơ của bạn"
          WHEN notification_type = 'invitation' THEN "Có nhà tuyển dụng mời bạn ứng tuyển"
          WHEN notification_type = 'newjob' THEN "Công ty bạn theo dõi có công việc mới"
    END AS type_name,
    content,
    is_read,
    created_at,
    c.company_name AS entity_name,
    entity_id,
    c.logo AS entity_logo
  FROM notification 
  LEFT JOIN company c ON c.company_id = notification.entity_id
  WHERE recipient_id = ? 
  ORDER BY created_at DESC;`,[jobseeker_id]
  );
  return result;
  
  
  }
  catch (error) {
    console.error("Error in queryGetNotification:", error);
    throw error;
  };
  };
  
  const queryUpdateReadNotification = async (jobseeker_id, notification_id) => {
    try {
      const [result] = await db.query(
        `UPDATE notification SET is_read = 1 WHERE recipient_id = ? AND notification_id = ?;`,
        [jobseeker_id, notification_id]
      );
      return result.affectedRows > 0; // Trả về true nếu cập nhật thành công
    } catch (error) {
      console.error("Error updating notification:", error);
      throw error; // Ném lại lỗi để xử lý ở nơi gọi hàm
    }
  }


 const queryChangePassword = async (jobseeker_id, newPassword) => {
  try {
    const [result] = await db.query(
      `UPDATE user_ SET password_ = ? WHERE user_id = ?;`,
      [newPassword, jobseeker_id]
    );
    return result.affectedRows > 0; // Trả về true nếu cập nhật thành công
  } catch (error) {
    console.error("Error updating password:", error);
    throw error; // Ném lại lỗi để xử lý ở nơi gọi hàm
  }
};



module.exports = {
  queryJobseekerGetJobDetail,
  queryGetItemProfile,
  queryDeleteItemProfile,
  queryAddItemProfile,
  queryUpdateItemProfile,
  queryUpdateJobseekerProfileImage,
  queryAddResume,
  queryGetResume,
  queryDeleteResume,
  queryShowHideResume,
  queryGetListJobApplication,
  queryApplyToJob,
  queryAddCompanyReview,
  queryGetListCompanyFollowing,
  queryDeleteCompanyFollowing,
  queryAddCompanyFollowing,
  queryGetListJobSaving,
  queryAddJobSaving,
  queryDeleteJobSaving,
  queryGetOverview,
  queryGetJobsSuggestion,

  queryGetNotification,
  queryUpdateReadNotification,

  queryChangePassword,
};