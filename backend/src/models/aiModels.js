import db from "../config/databaseConfig.js";

const queryGetJobseekerDetail = async (jobseeker_id) => {
    try {
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
                          'education_title', ce.education_title,
                          'major', pe.major,
                          'school', pe.school,
                          'from_', pe.from_,
                          'to_', pe.to_
                      )
                )
              from  profile_education pe
              join catalog_education ce on pe.education_id = ce.education_id
               where js.jobseeker_id = pe.profile_id),JSON_ARRAY())) 
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
      return jobseeker_detail[0] || null; // Return the first result or null if not found
    } catch (error) {
      console.error("Error getting jobseeker detail:", error);
      return null;
    } 
  };
  const queryGetJobDetailByUser = async (job_id) => {
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
          (select * from job_require_language jrl2 where jrl2.job_id = j.job_id) as jrl 
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
        (select * from job where job_id=? ) as j
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
        [ job_id]
      );
      return Job[0];
    } catch (error) {
      console.error("Error getting list job by user:", error);
      throw error; // Ném lại lỗi để xử lý ở nơi gọi hàm
    }
  };
  
export {
    queryGetJobseekerDetail ,
    queryGetJobDetailByUser
  };
  