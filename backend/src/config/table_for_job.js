module.exports = {
  job: {
    tableName: 'job',
    key: ['job_id'],
    fields: [
      'job_id', 'employer_id', 'title', 'date_post', 'date_expi', 'status_', 
      'industry_id', 'job_function_id', 'work_location', 'address', 
      'working_type', 'working_time', 'quantity', 'describle', 'views', 
      'numOfApplications', 'salary_max', 'salary_min', 'level_id', 
      'require_marital_status', 'require_gender', 'require_age_min', 
      'require_age_max', 'require_education', 'require_experience', 
      'more_requirements', 'lastUpdateOn'
    ],
    updateItem: [
      'title', 'date_expi', 'status_', 'industry_id', 'job_function_id', 
      'work_location', 'address', 'working_type', 'working_time', 'quantity', 
      'describle', 'salary_max', 'salary_min', 'level_id', 'require_marital_status', 
      'require_gender', 'require_age_min', 'require_age_max', 'require_education', 
      'require_experience', 'more_requirements', 'lastUpdateOn'
    ],
    addItem: [
      'employer_id', 'title', 'date_post', 'date_expi', 'status_', 'industry_id', 
      'job_function_id', 'work_location', 'address', 'working_type', 'working_time', 
      'quantity', 'describle', 'salary_max', 'salary_min', 'level_id', 
      'require_marital_status', 'require_gender', 'require_age_min', 'require_age_max', 
      'require_education', 'require_experience', 'more_requirements', 'lastUpdateOn'
    ]
  },
  job_require_skill: {
    tableName: 'job_require_skill',
    key: ['job_id', 'skill_id'],
    fields: ['job_id', 'skill_id'],
    updateItem: [],
    addItem: ['job_id', 'skill_id']
  },
  job_require_certification: {
    tableName: 'job_require_certification',
    key: ['job_id', 'certification'],
    fields: ['job_id', 'certification'],
    updateItem: [],
    addItem: ['job_id', 'certification']
  },
  job_require_language: {
    tableName: 'job_require_language',
    key: ['job_id', 'language_id'],
    fields: ['job_id', 'language_id'],
    updateItem: [],
    addItem: ['job_id', 'language_id']
  },
  job_tag: {
    tableName: 'job_tag',
    key: ['job_id', 'tag_id'],
    fields: ['job_id', 'tag_id'],
    updateItem: [],
    addItem: ['job_id', 'tag_id']
  },
  job_application: {
    tableName: 'logs_jobseeker_apply_job',
    key: ['jobseeker_id', 'job_id'],
    fields: ['jobseeker_id', 'job_id', 'created_at'],
    updateItem: [],
    addItem: ['jobseeker_id', 'job_id', 'created_at']
  },
  job_save: {
    tableName: 'logs_jobseeker_save_job',
    key: ['jobseeker_id', 'job_id'],
    fields: ['jobseeker_id', 'job_id', 'created_at'],
    updateItem: [],
    addItem: ['jobseeker_id', 'job_id', 'created_at']
  },
  job_view: {
    tableName: 'logs_jobseeker_view_job',
    key: ['jobseeker_id', 'job_id', 'created_at'],
    fields: ['jobseeker_id', 'job_id', 'created_at'],
    updateItem: [],
    addItem: ['jobseeker_id', 'job_id', 'created_at']
  }
};