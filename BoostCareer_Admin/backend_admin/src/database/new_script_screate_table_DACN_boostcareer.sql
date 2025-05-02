drop database if exists boostcareer;
create database boostcareer  default character set utf8mb4 default collate utf8mb4_unicode_ci;
#set foreign_key_checks=0;
#set foreign_key_checks=1;
use boostcareer;

## location: 3  #done
create table catalog_nation ( #done
nation_id smallint unsigned,
nation_name varchar(64) unique,
primary key (nation_id)
);
create table catalog_city (  #done
city_id smallint unsigned,
city_name varchar(64),
nation_id smallint unsigned,
primary key (city_id),
foreign key(nation_id) references catalog_nation(nation_id) on update cascade on delete cascade
);
create table catalog_district (  #done
district_id int unsigned,  
district_name varchar(64),
city_id smallint unsigned,
primary key (district_id),
foreign key(city_id) references catalog_city(city_id) on update cascade on delete cascade
);

## catalog: 9  #done
create table catalog_industry (  #done
industry_id smallint unsigned ,
industry_name varchar(64) unique,
primary key (industry_id)
);
create table catalog_job_function_parent( # update 11/03/2025
job_function_id smallint unsigned unique,
job_function_name varchar(128) unique,
job_count int unsigned default 0,
primary key (job_function_id)
);
create table catalog_job_function ( ## update 11/03/2025
job_function_id smallint unsigned unique,
job_function_parent_id smallint unsigned null,
job_function_name varchar(128) unique,
job_count int unsigned default 0,
primary key (job_function_id),
foreign key(job_function_parent_id) references catalog_job_function_parent(job_function_id) on update cascade on delete cascade
);
create table catalog_education (  #done
education_id smallint unsigned,
education_level tinyint unsigned,
education_title varchar(64) unique,
primary key (education_id)
);
create table catalog_language (  #done
language_id smallint unsigned, 
language_name varchar(64),
language_metrict varchar(64),
metric_value tinyint unsigned,
metric_display varchar(64),
primary key (language_id)
);
create table catalog_level (  #done
level_id smallint unsigned,
level_name varchar(128) unique,
primary_ tinyint unsigned,
primary key (level_id)
);
create table catalog_benefit (  #done
benefit_id smallint unsigned,
benefit_name varchar(128) unique,
benefit_nameEN varchar(128), ## change 10/03
benefit_icon varchar(64), ## change 10/03
primary key (benefit_id) 
);
create table catalog_role (  #done
role_id tinyint,
role_name varchar(64) unique,
primary key (role_id)
);
create table catalog_scale(  #done
scale_id tinyint,
scale_min int unsigned,
scale_max int unsigned,
primary key (scale_id)
);
drop table catalog_tags;
create table catalog_tags(  #done
tag_id int unsigned,
tags_content varchar(256) unique not null, ## change 10/03
tags_search_count  INT DEFAULT 0, ## change 10/03
primary key (tag_id)
);

## user: 4    #done
create table user_ (       #done
user_id int unsigned auto_increment,
username varchar(128) unique, # update 10/03/2025
email varchar(128) unique,
password_ varchar(128),
is_online bool default 0,
phone_number varchar(10),
create_date datetime not null,
role_id tinyint,
primary key (user_id),
foreign key(role_id) references catalog_role(role_id) on update cascade on delete cascade
);
create table user_admin (      #done
admin_id int unsigned,
avatar varchar(256) unique,
primary key (admin_id),
foreign key(admin_id) references user_(user_id) on update cascade on delete cascade
);
create table user_employer (    #done
employer_id int unsigned,
status_ bool  not null, 
primary key (employer_id),
foreign key(employer_id) references user_(user_id) on update cascade on delete cascade
);
create table user_jobseeker (    #done
jobseeker_id int unsigned,
avatar varchar(256),
status_ bool,
is_open_for_job bool not null default true,
primary key (jobseeker_id),
foreign key(jobseeker_id) references user_(user_id) on update cascade on delete cascade
);

## company: 3  #done
create table company (  #done
company_id int unsigned,
company_name varchar(256) not null,
logo varchar(256),
scale tinyint,
industry_id smallint unsigned,
phone_number varchar(11),
count_follower mediumint unsigned default 0,
describle text,
primary key (company_id),
foreign key(company_id) references user_employer(employer_id) on update cascade on delete cascade,
foreign key(scale) references catalog_scale(scale_id) on update cascade on delete cascade,
foreign key(industry_id) references catalog_industry(industry_id) on update cascade on delete cascade
);

create table company_location (  #done
company_id int unsigned not null,
district_id int unsigned not null,
address varchar(256), # update 12/03/2025
primary key (company_id,district_id),
foreign key(company_id) references company(company_id) on update cascade on delete cascade,
foreign key(district_id) references catalog_district(district_id) on update cascade on delete cascade
);

create table company_benefit (  #done
company_id int unsigned,
benefit_id  smallint unsigned,
benefit_value varchar(128),
primary key (company_id,benefit_id),
foreign key(company_id) references company(company_id) on update cascade on delete cascade,
foreign key(benefit_id) references catalog_benefit(benefit_id) on update cascade on delete cascade
);

## profile: 7 # done
drop table if exists profile_jobseeker; # done
create table profile_jobseeker (
profile_id int unsigned,
full_name varchar(256) not null,
title varchar(256),
level_id smallint unsigned,
job_function_id smallint unsigned,
career_target varchar(256),
work_place smallint unsigned,
salary_expect  int unsigned null default null,
year_exp tinyint unsigned null default null,
gender enum('male', 'female') default null,
birthday date ,
marital_status enum('Độc thân', 'Đã kết hôn') null default null,
address varchar(256), # update 12/03/2025
district_id int unsigned,
nationality smallint unsigned,
percent_complete tinyint unsigned not null default 0,
last_modify_date datetime not null,

primary key (profile_id),
foreign key(profile_id) references user_jobseeker(jobseeker_id) on update cascade on delete cascade,
foreign key(level_id) references catalog_level(level_id) on update cascade on delete cascade,
foreign key(job_function_id) references catalog_job_function(job_function_id) on update cascade on delete cascade,
foreign key(nationality) references catalog_nation(nation_id) on update cascade on delete cascade,
foreign key(district_id) references catalog_district(district_id) on update cascade on delete cascade
);


create table profile_certification ( # done
cert_id bigint unsigned, 
profile_id int unsigned,
certifications varchar(256) ,
month_ date not null,
primary key (cert_id),
foreign key(profile_id) references profile_jobseeker(profile_id) on update cascade on delete cascade
);
create table profile_education ( # done
edu_id bigint unsigned, 
profile_id int unsigned,
education_id smallint unsigned,
major varchar(128),
school varchar(256),
from_ date,
to_ date,
primary key (edu_id),
foreign key(profile_id) references profile_jobseeker(profile_id) on update cascade on delete cascade,
foreign key(education_id) references catalog_education(education_id) on update cascade on delete cascade
);
create table profile_skill ( # done
profile_id bigint unsigned, 
skill_id int unsigned ,
primary key (profile_id,skill_id),
foreign key(profile_id) references profile_jobseeker(profile_id) on update cascade on delete cascade,
foreign key (skill_id) references catalog_tags(tag_id) on update cascade on delete cascade
);
create table profile_experience ( # done
exp_id bigint unsigned,
profile_id int unsigned,
exp_title varchar(256),
exp_from date,
exp_to date,
exp_company varchar(256),
exp_description text,
primary key (exp_id),
foreign key(profile_id) references profile_jobseeker(profile_id) on update cascade on delete cascade
);
create table profile_project ( # done
project_id bigint unsigned,
profile_id int unsigned,
project_name varchar(256),
project_from date,
project_to date,
project_description text,
primary key (project_id),
foreign key(profile_id) references profile_jobseeker(profile_id) on update cascade on delete cascade
);
create table profile_cv (  # done
cv_id bigint unsigned, 
profile_id int unsigned,
cv_name varchar(256),
cv_link varchar(256),
date_upload datetime not null,
primary key (cv_id),
foreign key(profile_id) references profile_jobseeker(profile_id) on update cascade on delete cascade
);


## job: 5   # done
create table job (  # done
job_id bigint unsigned NOT NULL AUTO_INCREMENT,
employer_id int unsigned not null,
title varchar(128) not null,
date_post datetime not null,
date_expi datetime not null,
status_ bool not null,
industry smallint unsigned not null,
job_function smallint unsigned not null,
work_location smallint unsigned not null,
address varchar(256),
working_type enum('full-time','part-time','flexible') not null default 'full-time',
working_time text,
quantity smallint unsigned  not null default 1,
describle text not null,
views smallint unsigned not null default  0,
numOfApplications int unsigned default 0, # update march 10
 ##
salary_max int unsigned,
salary_min int unsigned,
level_id smallint unsigned,
require_marital_status enum('Không yêu cầu','Độc thân', 'Đã kết hôn') default null,
require_gender enum('Không yêu cầu','nam', 'nữ') default null,
require_age_min tinyint unsigned,
require_age_max tinyint unsigned,
require_education smallint unsigned,  
require_experience tinyint unsigned,
more_requirements text,
lastUpdatedOn datetime,  # update march 10
primary key (job_id),
foreign key(employer_id) references employer(employer_id) on update cascade on delete cascade,
foreign key(job_function) references catalog_job_function(job_function_id) on update cascade on delete cascade,
foreign key(industry) references catalog_industry(industry_id) on update cascade on delete cascade,
foreign key(work_location) references catalog_city(city_id) on update cascade on delete cascade,
foreign key(level_id) references catalog_level(level_id) on update cascade on delete cascade,
foreign key(require_education) references catalog_education(education_id ) on update cascade on delete set null
);
create table job_require_skill ( # done
job_id bigint unsigned,
skill_id int unsigned,
primary key (job_id,skill_id),
foreign key(job_id) references job(job_id) on update cascade on delete cascade,
foreign key (skill_id) references catalog_tags(tag_id) on update cascade on delete cascade
);
create table job_require_certification ( # done
job_id bigint unsigned,
certification varchar(256) ,
primary key (job_id,certification),
foreign key(job_id) references job(job_id) on update cascade on delete cascade
);
create table job_require_language (  # done
job_id bigint unsigned,
language_id smallint unsigned,
primary key (job_id,language_id),
foreign key(job_id) references job(job_id) on update cascade on delete cascade,
foreign key(language_id) references catalog_language(language_id) on update cascade on delete cascade
);
create table job_tags (  # done
job_id bigint unsigned,
tag_id int unsigned,
primary key (job_id,tag_id),
foreign key(job_id) references job(job_id) on update cascade on delete cascade,
foreign key(tag_id) references catalog_tags(tag_id) on update cascade on delete cascade
);


## table of relation: 8 # done
create table logs_jobseeker_apply_job ( # done
logs_id bigint unsigned,
jobseeker_id int unsigned,
job_id bigint unsigned,
date_appy datetime,
primary key (logs_id),
unique (jobseeker_id,job_id),
foreign key(jobseeker_id) references user_jobseeker(jobseeker_id) on update cascade on delete cascade,
foreign key(job_id) references job(job_id) on update cascade on delete cascade
);
create table logs_jobseeker_follow_employer ( # done
jobseeker_id int unsigned,
employer_id int unsigned,
date_time datetime,
primary key  (jobseeker_id,employer_id),
foreign key(employer_id) references user_employer(employer_id) on update cascade on delete cascade,
foreign key(jobseeker_id) references user_jobseeker(jobseeker_id) on update cascade on delete cascade
);
create table logs_jobseeker_save_job ( # done
jobseeker_id int unsigned,
job_id bigint unsigned,
date_time datetime,
primary key (jobseeker_id,job_id),
foreign key(job_id) references job(job_id) on update cascade on delete cascade,
foreign key(jobseeker_id) references user_jobseeker(jobseeker_id) on update cascade on delete cascade
);
create table logs_review ( # done
logs_id int unsigned,
jobseeker_id int unsigned,
company_id int unsigned,
date_time datetime,
score smallint, 
content text,
primary key (logs_id),
unique (jobseeker_id, company_id),
foreign key(jobseeker_id) references user_jobseeker(jobseeker_id) on update cascade on delete cascade,
foreign key(company_id) references company(company_id) on update cascade on delete cascade
);
create table logs_employer_rate_jobseeker ( # done
employer_id int unsigned,
jobseeker_id int unsigned,
score smallint, 
date_time datetime,
primary key (employer_id,jobseeker_id),
foreign key(jobseeker_id) references user_jobseeker(jobseeker_id) on update cascade on delete cascade,
foreign key(employer_id) references user_employer(employer_id) on update cascade on delete cascade
);
create table logs_employer_save_jobseeker ( # done
employer_id int unsigned,
jobseeker_id int unsigned,
date_time datetime,
primary key (employer_id,jobseeker_id),
foreign key(employer_id) references user_employer(employer_id) on update cascade on delete cascade,
foreign key(jobseeker_id) references user_jobseeker(jobseeker_id) on update cascade on delete cascade
);
CREATE TABLE logs_jobseeker_view_job(
    jobseeker_id int unsigned,
    job_id bigint unsigned not null,
    date_view datetime not null,
    primary key (jobseeker_id,job_id,date_view),
    foreign key (jobseeker_id) references user_jobseeker(jobseeker_id) on update cascade on delete cascade,
    foreign key(job_id) references job(job_id) on update cascade on delete cascade
);
CREATE TABLE logs_employer_view_jobseeker(
	employer_id int unsigned ,
    jobseeker_id int unsigned not null,
    date_view datetime not null,
    is_read BOOLEAN DEFAULT FALSE,
    primary key (employer_id,jobseeker_id,date_view),
    foreign key(employer_id) references user_employer(employer_id) on update cascade on delete cascade,
foreign key(jobseeker_id) references user_jobseeker(jobseeker_id) on update cascade on delete cascade
);


## messenger: 1
create table messenger (  # done
messenger_id bigint auto_increment, # update 07/03/2025
messenger_title varchar(256), # update 07/03/2025
sender_id int unsigned,
receiver_id int unsigned,
is_from_admin bool not null default 0,
is_read boolean default false,
date_time datetime,
content text,
primary key (messenger_id),
foreign key(sender_id) references user_(user_id) on update cascade on delete cascade,
foreign key(receiver_id) references user_(user_id) on update cascade on delete cascade
);

## table of backup and slide
create table system_backup_ ( # done
backup_id smallint unsigned,
backup_name int unsigned,
daytime time,
desciption text,
url varchar(256),
primary key (backup_id)
);
create table system_slide_images ( # done
slide_id smallint unsigned,
slide_order smallint unsigned,
display bool,
description text,
url varchar(256),
primary key (slide_id)
);

## table of setting
CREATE TABLE system_profile_completion_config (
    column_name VARCHAR(256) PRIMARY KEY,
    weight DECIMAL(2, 0) NOT NULL DEFAULT 0
);
CREATE TABLE system_default (
    column_name VARCHAR(256) PRIMARY KEY,
    value varchar(256)
);

-- set foreign_key_checks=0;
-- set foreign_key_checks=1;




################################################################################################################################################################################
################################################################################################################################################################################
################################################################################################################################################################################
########################## bonus:

INSERT INTO system_profile_completion_config (column_name, weight) VALUES ('full_name ',5), ('title ',5), ('level_id ',5), ('job_function_id ',5), ('career_target ',5), ('work_place ',5), ('salary_expect ',5), ('year_exp ',5), ('personal',5), ('address',5), ('Certification',10), ('Education',10), ('Skill',10), ('Experience',10), ('Project',10);
INSERT INTO system_default (column_name,value) values ('img_default_company', 'https://boostcareer.s3.us-east-1.amazonaws.com/images/img_df_company.png');
INSERT INTO system_default (column_name,value) values ('img_default_jobseeker', 'https://boostcareer.s3.us-east-1.amazonaws.com/images/img_df_jobseeker.png');

############################
RENAME TABLE admin_ TO user_admin;
RENAME TABLE employer TO user_employer;
RENAME TABLE jobseeker TO user_jobseeker;

