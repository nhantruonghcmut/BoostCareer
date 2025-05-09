CREATE TABLE `catalog_benefit` (
  `benefit_id` smallint unsigned NOT NULL,
  `benefit_name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `benefit_nameEN` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `benefit_icon` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`benefit_id`),
  UNIQUE KEY `benefit_name` (`benefit_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `catalog_city` (
  `city_id` smallint unsigned NOT NULL,
  `city_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nation_id` smallint unsigned DEFAULT NULL,
  PRIMARY KEY (`city_id`),
  KEY `nation_id` (`nation_id`),
  CONSTRAINT `catalog_city_ibfk_1` FOREIGN KEY (`nation_id`) REFERENCES `catalog_nation` (`nation_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `catalog_district` (
  `district_id` int unsigned NOT NULL,
  `district_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city_id` smallint unsigned DEFAULT NULL,
  PRIMARY KEY (`district_id`),
  KEY `city_id` (`city_id`),
  CONSTRAINT `catalog_district_ibfk_1` FOREIGN KEY (`city_id`) REFERENCES `catalog_city` (`city_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `catalog_education` (
  `education_id` smallint unsigned NOT NULL,
  `education_level` tinyint unsigned DEFAULT NULL,
  `education_title` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`education_id`),
  UNIQUE KEY `education_title` (`education_title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `catalog_industry` (
  `industry_id` smallint unsigned NOT NULL,
  `industry_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`industry_id`),
  UNIQUE KEY `industry_name` (`industry_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `catalog_job_function` (
  `job_function_id` smallint unsigned NOT NULL,
  `job_function_parent_id` smallint unsigned DEFAULT NULL,
  `job_function_name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `job_count` int unsigned DEFAULT '0',
  PRIMARY KEY (`job_function_id`),
  UNIQUE KEY `job_function_id` (`job_function_id`),
  UNIQUE KEY `job_function_name` (`job_function_name`),
  KEY `job_function_parent_id` (`job_function_parent_id`),
  CONSTRAINT `catalog_job_function_ibfk_1` FOREIGN KEY (`job_function_parent_id`) REFERENCES `catalog_job_function_parent` (`job_function_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `catalog_job_function_parent` (
  `job_function_id` smallint unsigned NOT NULL,
  `job_function_name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `job_count` int unsigned DEFAULT '0',
  PRIMARY KEY (`job_function_id`),
  UNIQUE KEY `job_function_id` (`job_function_id`),
  UNIQUE KEY `job_function_name` (`job_function_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `catalog_language` (
  `language_id` smallint unsigned NOT NULL,
  `language_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `language_metrict` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metric_value` tinyint unsigned DEFAULT NULL,
  `metric_display` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`language_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `catalog_level` (
  `level_id` smallint unsigned NOT NULL,
  `level_name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `primary_` tinyint unsigned DEFAULT NULL,
  PRIMARY KEY (`level_id`),
  UNIQUE KEY `level_name` (`level_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `catalog_nation` (
  `nation_id` smallint unsigned NOT NULL,
  `nation_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`nation_id`),
  UNIQUE KEY `nation_name` (`nation_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `catalog_role` (
  `role_id` tinyint NOT NULL,
  `role_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `role_name` (`role_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `catalog_scale` (
  `scale_id` tinyint NOT NULL,
  `scale_min` int unsigned DEFAULT NULL,
  `scale_max` int unsigned DEFAULT NULL,
  PRIMARY KEY (`scale_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `catalog_tags` (
  `tag_id` int unsigned NOT NULL,
  `tags_content` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tags_search_count` int DEFAULT '0',
  PRIMARY KEY (`tag_id`),
  UNIQUE KEY `tags_content` (`tags_content`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `user_` (
  `user_id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password_` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_online` tinyint(1) DEFAULT '0',
  `phone_number` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `create_at` datetime DEFAULT NULL,
  `role_id` tinyint DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `user__ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `catalog_role` (`role_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30000032 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `user_admin` (
  `admin_id` int unsigned NOT NULL,
  `avatar` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `avatar` (`avatar`),
  CONSTRAINT `user_admin_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `user_` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `user_employer` (
  `employer_id` int unsigned NOT NULL,
  `status_` tinyint(1) NOT NULL,
  PRIMARY KEY (`employer_id`),
  CONSTRAINT `user_employer_ibfk_1` FOREIGN KEY (`employer_id`) REFERENCES `user_` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `user_jobseeker` (
  `jobseeker_id` int unsigned NOT NULL,
  `avatar` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status_` tinyint(1) DEFAULT NULL,
  `is_open_for_job` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`jobseeker_id`),
  CONSTRAINT `user_jobseeker_ibfk_1` FOREIGN KEY (`jobseeker_id`) REFERENCES `user_` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


CREATE TABLE `company` (
  `company_id` int unsigned NOT NULL,
  `company_name` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `logo` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scale_id` tinyint DEFAULT NULL,
  `industry_id` smallint unsigned DEFAULT NULL,
  `phone_number` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `describle` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `count_follower` mediumint unsigned DEFAULT '0',
  `background` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`company_id`),
  KEY `scale` (`scale_id`),
  KEY `industry_id` (`industry_id`),
  CONSTRAINT `company_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `user_employer` (`employer_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `company_ibfk_2` FOREIGN KEY (`scale_id`) REFERENCES `catalog_scale` (`scale_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `company_ibfk_3` FOREIGN KEY (`industry_id`) REFERENCES `catalog_industry` (`industry_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `company_benefit` (
  `company_id` int unsigned NOT NULL,
  `benefit_id` smallint unsigned NOT NULL,
  `benefit_value` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`company_id`,`benefit_id`),
  KEY `benefit_id` (`benefit_id`),
  CONSTRAINT `company_benefit_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `company_benefit_ibfk_2` FOREIGN KEY (`benefit_id`) REFERENCES `catalog_benefit` (`benefit_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `company_location` (
  `location_id` int unsigned NOT NULL AUTO_INCREMENT,
  `company_id` int unsigned NOT NULL,
  `city_id` smallint unsigned NOT NULL,
  `address` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`location_id`),
  UNIQUE KEY `unique_company_city` (`company_id`,`city_id`),
  KEY `city_id` (`city_id`),
  CONSTRAINT `fk_city` FOREIGN KEY (`city_id`) REFERENCES `catalog_city` (`city_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_company` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=547 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `job` (
  `job_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `employer_id` int unsigned NOT NULL,
  `title` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_post` datetime NOT NULL,
  `date_expi` datetime NOT NULL,
  `status_` tinyint(1) NOT NULL,
  `industry_id` smallint unsigned NOT NULL,
  `job_function_id` smallint unsigned NOT NULL,
  `work_location` smallint unsigned NOT NULL,
  `address` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `working_type` enum('full-time','part-time','flexible') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'full-time',
  `working_time` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `quantity` smallint unsigned NOT NULL DEFAULT '1',
  `describle` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `views` smallint unsigned NOT NULL DEFAULT '0',
  `numOfApplications` int unsigned DEFAULT '0',
  `salary_max` int unsigned DEFAULT NULL,
  `salary_min` int unsigned DEFAULT NULL,
  `level_id` smallint unsigned DEFAULT NULL,
  `require_marital_status` enum('Không yêu cầu','Độc thân','Đã kết hôn') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `require_gender` enum('Không yêu cầu','nam','nữ') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `require_age_min` tinyint unsigned DEFAULT NULL,
  `require_age_max` tinyint unsigned DEFAULT NULL,
  `require_education` smallint unsigned DEFAULT NULL,
  `require_experience` tinyint unsigned DEFAULT NULL,
  `more_requirements` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `create_at` datetime DEFAULT NULL,
  `lastUpdateOn` datetime DEFAULT NULL,
  PRIMARY KEY (`job_id`),
  KEY `employer_id` (`employer_id`),
  KEY `job_function` (`job_function_id`),
  KEY `industry` (`industry_id`),
  KEY `work_location` (`work_location`),
  KEY `level_id` (`level_id`),
  KEY `education_at_least` (`require_education`),
  CONSTRAINT `job_ibfk_1` FOREIGN KEY (`employer_id`) REFERENCES `user_employer` (`employer_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `job_ibfk_2` FOREIGN KEY (`job_function_id`) REFERENCES `catalog_job_function` (`job_function_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `job_ibfk_3` FOREIGN KEY (`industry_id`) REFERENCES `catalog_industry` (`industry_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `job_ibfk_4` FOREIGN KEY (`work_location`) REFERENCES `catalog_city` (`city_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `job_ibfk_5` FOREIGN KEY (`level_id`) REFERENCES `catalog_level` (`level_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `job_ibfk_6` FOREIGN KEY (`require_education`) REFERENCES `catalog_education` (`education_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1866903 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `job_require_certification` (
  `job_id` bigint unsigned NOT NULL,
  `certification` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`job_id`,`certification`),
  CONSTRAINT `job_require_certification_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `job` (`job_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `job_require_language` (
  `job_id` bigint unsigned NOT NULL,
  `language_id` smallint unsigned NOT NULL,
  PRIMARY KEY (`job_id`,`language_id`),
  KEY `language_id` (`language_id`),
  CONSTRAINT `job_require_language_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `job` (`job_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `job_require_language_ibfk_2` FOREIGN KEY (`language_id`) REFERENCES `catalog_language` (`language_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `job_require_skill` (
  `job_id` bigint unsigned NOT NULL,
  `skill_id` int unsigned NOT NULL,
  PRIMARY KEY (`job_id`,`skill_id`),
  KEY `skill_id` (`skill_id`),
  CONSTRAINT `job_require_skill_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `job` (`job_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `job_require_skill_ibfk_2` FOREIGN KEY (`skill_id`) REFERENCES `catalog_tags` (`tag_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `logs_employer_invitation` (
  `employer_id` int unsigned NOT NULL,
  `jobseeker_id` int unsigned NOT NULL,
  `job_id` bigint unsigned NOT NULL,
  `create_at` datetime NOT NULL,
  PRIMARY KEY (`employer_id`,`jobseeker_id`,`job_id`),
  KEY `job_id` (`job_id`),
  KEY `jobseeker_id` (`jobseeker_id`),
  CONSTRAINT `logs_employer_invitation_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `job` (`job_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `logs_employer_invitation_ibfk_2` FOREIGN KEY (`employer_id`) REFERENCES `user_employer` (`employer_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `logs_employer_invitation_ibfk_3` FOREIGN KEY (`jobseeker_id`) REFERENCES `user_jobseeker` (`jobseeker_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `logs_employer_rate_jobseeker` (
  `employer_id` int unsigned NOT NULL,
  `jobseeker_id` int unsigned NOT NULL,
  `score` smallint DEFAULT NULL,
  `create_at` datetime DEFAULT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`employer_id`,`jobseeker_id`),
  KEY `jobseeker_id` (`jobseeker_id`),
  CONSTRAINT `logs_employer_rate_jobseeker_ibfk_1` FOREIGN KEY (`jobseeker_id`) REFERENCES `user_jobseeker` (`jobseeker_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `logs_employer_rate_jobseeker_ibfk_2` FOREIGN KEY (`employer_id`) REFERENCES `user_employer` (`employer_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `logs_employer_save_jobseeker` (
  `employer_id` int unsigned NOT NULL,
  `jobseeker_id` int unsigned NOT NULL,
  `create_at` datetime DEFAULT NULL,
  PRIMARY KEY (`employer_id`,`jobseeker_id`),
  KEY `jobseeker_id` (`jobseeker_id`),
  CONSTRAINT `logs_employer_save_jobseeker_ibfk_1` FOREIGN KEY (`employer_id`) REFERENCES `user_employer` (`employer_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `logs_employer_save_jobseeker_ibfk_2` FOREIGN KEY (`jobseeker_id`) REFERENCES `user_jobseeker` (`jobseeker_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `logs_employer_view_jobseeker` (
  `employer_id` int unsigned NOT NULL,
  `jobseeker_id` int unsigned NOT NULL,
  `create_at` datetime NOT NULL,
  PRIMARY KEY (`employer_id`,`jobseeker_id`,`create_at`),
  KEY `jobseeker_id` (`jobseeker_id`),
  CONSTRAINT `logs_employer_view_jobseeker_ibfk_1` FOREIGN KEY (`employer_id`) REFERENCES `user_employer` (`employer_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `logs_employer_view_jobseeker_ibfk_2` FOREIGN KEY (`jobseeker_id`) REFERENCES `user_jobseeker` (`jobseeker_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `logs_jobseeker_apply_job` (
  `jobseeker_id` int unsigned NOT NULL,
  `job_id` bigint unsigned NOT NULL,
  `create_at` datetime DEFAULT NULL,
  `isreject` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`jobseeker_id`,`job_id`),
  KEY `job_id` (`job_id`),
  CONSTRAINT `logs_jobseeker_apply_job_ibfk_1` FOREIGN KEY (`jobseeker_id`) REFERENCES `user_jobseeker` (`jobseeker_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `logs_jobseeker_apply_job_ibfk_2` FOREIGN KEY (`job_id`) REFERENCES `job` (`job_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `logs_jobseeker_follow_employer` (
  `jobseeker_id` int unsigned NOT NULL,
  `employer_id` int unsigned NOT NULL,
  `create_at` datetime DEFAULT NULL,
  PRIMARY KEY (`jobseeker_id`,`employer_id`),
  KEY `employer_id` (`employer_id`),
  CONSTRAINT `logs_jobseeker_follow_employer_ibfk_1` FOREIGN KEY (`employer_id`) REFERENCES `user_employer` (`employer_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `logs_jobseeker_follow_employer_ibfk_2` FOREIGN KEY (`jobseeker_id`) REFERENCES `user_jobseeker` (`jobseeker_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `logs_jobseeker_save_job` (
  `jobseeker_id` int unsigned NOT NULL,
  `job_id` bigint unsigned NOT NULL,
  `create_at` datetime DEFAULT NULL,
  PRIMARY KEY (`jobseeker_id`,`job_id`),
  KEY `job_id` (`job_id`),
  CONSTRAINT `logs_jobseeker_save_job_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `job` (`job_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `logs_jobseeker_save_job_ibfk_2` FOREIGN KEY (`jobseeker_id`) REFERENCES `user_jobseeker` (`jobseeker_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `logs_jobseeker_view_job` (
  `log_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `jobseeker_id` int unsigned NOT NULL,
  `job_id` bigint unsigned NOT NULL,
  `create_at` datetime NOT NULL,
  PRIMARY KEY (`log_id`),
  KEY `job_id` (`job_id`),
  KEY `logs_jobseeker_view_job_ibfk_1` (`jobseeker_id`),
  CONSTRAINT `logs_jobseeker_view_job_ibfk_1` FOREIGN KEY (`jobseeker_id`) REFERENCES `user_jobseeker` (`jobseeker_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `logs_jobseeker_view_job_ibfk_2` FOREIGN KEY (`job_id`) REFERENCES `job` (`job_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `logs_review` (
  `jobseeker_id` int unsigned NOT NULL,
  `company_id` int unsigned NOT NULL,
  `create_at` datetime DEFAULT NULL,
  `score` smallint DEFAULT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`jobseeker_id`,`company_id`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `logs_review_ibfk_1` FOREIGN KEY (`jobseeker_id`) REFERENCES `user_jobseeker` (`jobseeker_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `logs_review_ibfk_2` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `notification` (
  `notification_id` bigint NOT NULL AUTO_INCREMENT,
  `recipient_id` int unsigned NOT NULL,
  `notification_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_id` bigint DEFAULT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`),
  KEY `recipient_id` (`recipient_id`),
  KEY `notification_type` (`notification_type`),
  KEY `entity_id` (`entity_id`),
  CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`recipient_id`) REFERENCES `user_` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `profile_certification` (
  `profile_certifications_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `profile_id` int unsigned DEFAULT NULL,
  `certifications` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `month_` date NOT NULL,
  PRIMARY KEY (`profile_certifications_id`),
  KEY `profile_id` (`profile_id`),
  CONSTRAINT `profile_certification_ibfk_1` FOREIGN KEY (`profile_id`) REFERENCES `profile_jobseeker` (`profile_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `profile_cv` (
  `cv_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `profile_id` int unsigned DEFAULT NULL,
  `cv_name` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cv_link` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `s3_key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `create_at` datetime DEFAULT NULL,
  `isactive` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`cv_id`),
  KEY `profile_id` (`profile_id`),
  CONSTRAINT `profile_cv_ibfk_1` FOREIGN KEY (`profile_id`) REFERENCES `profile_jobseeker` (`profile_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `profile_education` (
  `profile_education_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `profile_id` int unsigned DEFAULT NULL,
  `education_id` smallint unsigned DEFAULT NULL,
  `major` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `school` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `from_` date DEFAULT NULL,
  `to_` date DEFAULT NULL,
  PRIMARY KEY (`profile_education_id`),
  KEY `profile_id` (`profile_id`),
  KEY `education_id` (`education_id`),
  CONSTRAINT `profile_education_ibfk_1` FOREIGN KEY (`profile_id`) REFERENCES `profile_jobseeker` (`profile_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `profile_education_ibfk_2` FOREIGN KEY (`education_id`) REFERENCES `catalog_education` (`education_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `profile_experience` (
  `profile_experience_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `profile_id` int unsigned DEFAULT NULL,
  `exp_title` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `exp_from` date DEFAULT NULL,
  `exp_to` date DEFAULT NULL,
  `exp_company` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `exp_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`profile_experience_id`),
  KEY `profile_id` (`profile_id`),
  CONSTRAINT `profile_experience_ibfk_1` FOREIGN KEY (`profile_id`) REFERENCES `profile_jobseeker` (`profile_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `profile_jobseeker` (
  `profile_id` int unsigned NOT NULL,
  `full_name` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `level_id` smallint unsigned DEFAULT NULL,
  `job_function_id` smallint unsigned DEFAULT NULL,
  `career_target` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `city_id` smallint unsigned DEFAULT NULL,
  `salary_expect` int unsigned DEFAULT NULL,
  `year_exp` tinyint unsigned DEFAULT NULL,
  `gender` enum('male','female') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `marital_status` enum('Độc thân','Đã kết hôn') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `district_id` int unsigned DEFAULT NULL,
  `nationality_id` smallint unsigned DEFAULT NULL,
  `percent_complete` tinyint unsigned NOT NULL DEFAULT '0',
  `create_at` datetime DEFAULT NULL,
  PRIMARY KEY (`profile_id`),
  KEY `level_id` (`level_id`),
  KEY `job_function_id` (`job_function_id`),
  KEY `nationality` (`nationality_id`),
  KEY `district_id` (`district_id`),
  CONSTRAINT `profile_jobseeker_ibfk_1` FOREIGN KEY (`profile_id`) REFERENCES `user_jobseeker` (`jobseeker_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `profile_jobseeker_ibfk_2` FOREIGN KEY (`level_id`) REFERENCES `catalog_level` (`level_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `profile_jobseeker_ibfk_3` FOREIGN KEY (`job_function_id`) REFERENCES `catalog_job_function` (`job_function_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `profile_jobseeker_ibfk_4` FOREIGN KEY (`nationality_id`) REFERENCES `catalog_nation` (`nation_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `profile_jobseeker_ibfk_5` FOREIGN KEY (`district_id`) REFERENCES `catalog_district` (`district_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `profile_language` (
  `profile_id` int unsigned NOT NULL,
  `language_id` smallint unsigned NOT NULL,
  PRIMARY KEY (`profile_id`,`language_id`),
  KEY `language_id` (`language_id`),
  CONSTRAINT `profile_language_ibfk_1` FOREIGN KEY (`profile_id`) REFERENCES `profile_jobseeker` (`profile_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `profile_language_ibfk_2` FOREIGN KEY (`language_id`) REFERENCES `catalog_language` (`language_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `profile_project` (
  `profile_project_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `profile_id` int unsigned DEFAULT NULL,
  `project_name` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `project_from` date DEFAULT NULL,
  `project_to` date DEFAULT NULL,
  `project_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`profile_project_id`),
  KEY `profile_id` (`profile_id`),
  CONSTRAINT `profile_project_ibfk_1` FOREIGN KEY (`profile_id`) REFERENCES `profile_jobseeker` (`profile_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `profile_skill` (
  `profile_id` int unsigned NOT NULL,
  `skill_id` int unsigned NOT NULL,
  PRIMARY KEY (`profile_id`,`skill_id`),
  KEY `skill_id` (`skill_id`),
  CONSTRAINT `profile_skill_ibfk_1` FOREIGN KEY (`profile_id`) REFERENCES `profile_jobseeker` (`profile_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `profile_skill_ibfk_2` FOREIGN KEY (`skill_id`) REFERENCES `catalog_tags` (`tag_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `system_default` (
  `column_name` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`column_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `system_profile_completion_config` (
  `column_name` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `weight` decimal(2,0) NOT NULL DEFAULT '0',
  PRIMARY KEY (`column_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


