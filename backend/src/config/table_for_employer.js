module.exports = {
  // Employer Basic information
  Basic: {
    tableName: 'user_employer',
    key: ['employer_id'],
    fields: ['employer_id', 'status_'],
    updateItem: ['status_'],
    addItem: []
  },
  
  // Company information
  company: {
    tableName: 'company',
    key: ['company_id'],
    fields: ['company_id', 'company_name', 'logo', 'scale_id', 'industry_id', 
              'count_follower', 'describle'],
    updateItem: ['company_name', 'logo', 'scale_id', 'industry_id', 
                 , 'describle','background'],
    addItem: []
  },
  
  // Company location information
  company_location: {
    tableName: 'company_location',
    key: ['location_id'],
    fields: ['location_id','company_id', 'city_id', 'address'],
    updateItem: ['city_id','address'],
    addItem: ['company_id', 'city_id', 'address']
  },
  
  // Company benefits
  company_benefit: {
    tableName: 'company_benefit',
    key: ['company_id', 'benefit_id'],
    fields: ['company_id', 'benefit_id', 'benefit_value'],
    updateItem: ['benefit_value'],
    addItem: ['company_id', 'benefit_id', 'benefit_value']
  },
  
  // Job postings
  job: {
    tableName: 'job',
    key: ['job_id'],
    fields: ['job_id', 'employer_id', 'title', 'date_post', 'date_expi', 'status_',
             'industry_id', 'job_function_id', 'work_location_id', 'address', 
             'working_type', 'working_time', 'quantity', 'describle', 'views',
             'numOfApplications', 'salary_max', 'salary_min', 'level_id', 
             'require_marital_status', 'require_gender', 'require_age_min',
             'require_age_max', 'require_education', 'require_experience',
             'more_requirements', 'lastUpdatedOn'],
    updateItem: ['title', 'date_expi', 'status_', 'industry_id', 'job_function_id',
                 'work_location_id', 'address', 'working_type', 'working_time', 
                 'quantity', 'describle', 'salary_max', 'salary_min', 'level_id',
                 'require_marital_status', 'require_gender', 'require_age_min',
                 'require_age_max', 'require_education', 'require_experience',
                 'more_requirements', 'lastUpdatedOn'],
    addItem: ['employer_id', 'title', 'date_post', 'date_expi', 'status_', 
              'industry_id', 'job_function_id', 'work_location_id', 'address',
              'working_type', 'working_time', 'quantity', 'describle', 
              'salary_max', 'salary_min', 'level_id', 'require_marital_status', 
              'require_gender', 'require_age_min', 'require_age_max', 
              'require_education', 'require_experience', 'more_requirements',
              'lastUpdatedOn']
  },
  
  // Job required skills
  job_require_skill: {
    tableName: 'job_require_skill',
    key: ['job_id', 'skill_id'],
    fields: ['job_id', 'skill_id'],
    updateItem: [],
    addItem: ['job_id', 'skill_id']
  },
  
  // Job required certifications
  job_require_certification: {
    tableName: 'job_require_certification',
    key: ['job_id', 'certification'],
    fields: ['job_id', 'certification'],
    updateItem: [],
    addItem: ['job_id', 'certification']
  },
  
  // Job required languages
  job_require_language: {
    tableName: 'job_require_language',
    key: ['job_id', 'language_id'],
    fields: ['job_id', 'language_id'],
    updateItem: [],
    addItem: ['job_id', 'language_id']
  },
  
  // Job tags
  job_tag: {
    tableName: 'job_tag',
    key: ['job_id', 'tag_id'],
    fields: ['job_id', 'tag_id'],
    updateItem: [],
    addItem: ['job_id', 'tag_id']
  },
  
  // Employer rating jobseekers
  rate_jobseeker: {
    tableName: 'logs_employer_rate_jobseeker',
    key: ['employer_id', 'jobseeker_id'],
    fields: ['employer_id', 'jobseeker_id', 'score', 'created_at'],
    updateItem: ['score'],
    addItem: ['employer_id', 'jobseeker_id', 'score', 'created_at']
  },
  
  // Employer saving jobseekers
  save_jobseeker: {
    tableName: 'logs_employer_save_jobseeker',
    key: ['employer_id', 'jobseeker_id'],
    fields: ['employer_id', 'jobseeker_id', 'created_at'],
    updateItem: [],
    addItem: ['employer_id', 'jobseeker_id', 'created_at']
  },
  
  // Employer viewing jobseekers
  view_jobseeker: {
    tableName: 'logs_employer_view_jobseeker',
    key: ['employer_id', 'jobseeker_id', 'created_at'],
    fields: ['employer_id', 'jobseeker_id', 'created_at', 'is_read'],
    updateItem: ['is_read'],
    addItem: ['employer_id', 'jobseeker_id', 'created_at', 'is_read']
  }
};