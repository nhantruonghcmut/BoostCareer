
## LOCATION: 4
create table Catalog_Nation (
Nation_ID smallint UNSIGNED,
Nation_name varchar(64) unique,
primary key (Nation_ID)
);

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name="catalog_role")
public class CatalogRole {

@C
private String nationName;

}



create table Catalog_City (
City_ID smallint UNSIGNED,
City_name varchar(64),
Nation_ID smallint UNSIGNED,
primary key (City_ID),
foreign key(Nation_ID) references Catalog_Nation(Nation_ID) on update cascade on delete cascade
);
create table Catalog_District (
District_ID smallint UNSIGNED,
District_name varchar(64),
City_ID smallint UNSIGNED,
primary key (District_ID),
foreign key(City_ID) references Catalog_City(City_ID) on update cascade on delete cascade
);
create table Location (
Location_ID int UNSIGNED,
Nation_ID smallint UNSIGNED,
City_ID smallint UNSIGNED,
District_ID smallint UNSIGNED,
Address varchar(128),
unique(Nation_ID,City_ID,District_ID),
primary key (Location_ID),
foreign key(Nation_ID) references Catalog_Nation(Nation_ID) on update cascade on delete cascade,
foreign key(City_ID) references Catalog_City(City_ID) on update cascade on delete cascade,
foreign key(District_ID) references Catalog_District(District_ID) on update cascade on delete cascade
);

## CATALOG: 8
create table Catalog_Industries (
Industry_ID smallint UNSIGNED ,
Industry_name varchar(64) unique,
primary key (Industry_ID)
);
create table Catalog_Education (
Education_ID smallint UNSIGNED,
Education_level tinyint UNSIGNED,
Education_title varchar(64) unique,
primary key (Education_ID)
);

create table Catalog_benefit (
Benefit_ID smallint UNSIGNED,
Benefit_name varchar(128) unique,
primary key (Benefit_ID)
);

create table Catalog_language (
Language_ID smallint UNSIGNED,
Language_name varchar(64) unique,
primary key (Language_ID)
);

create table Catalog_Job_function (
Job_function_ID smallint UNSIGNED Unique,
Job_parent_ID smallint UNSIGNED NULL,
Job_function_name varchar(128) unique,
primary key (Job_function_ID),
foreign key(Job_parent_ID) references Catalog_Job_function(Job_function_ID) on update cascade on delete cascade
);

create table Catalog_level (
Level_ID smallint UNSIGNED,
Level_name varchar(128) unique,
Primary_ tinyint UNSIGNED,
primary key (Level_ID)
);
create table Catalog_role (
Role_ID tinyint,
Role_name varchar(64) unique,
primary key (Role_ID)
);

create table Catalog_scale(
Scale_ID tinyint,
Scale_min int unsigned,
Scale_max int unsigned,
primary key (Scale_ID)
);


create table Catalog_working_type(
working_type_ID tinyint,
working_type_name varchar(64),
primary key (working_type_ID)
);
## Company: 4
create table Company (
Company_ID int UNSIGNED,
company_name varchar(256) ,
Logo varchar(256),
Scale mediumint,
Describle text,
primary key (Company_ID)
);
create table Company_Phone_number (
Company_ID int UNSIGNED,
Phone_number varchar(10),
primary key (Company_ID,Phone_number),
foreign key(Company_ID) references Company(Company_ID) on update cascade on delete cascade
);
create table Company_Location (
Company_ID int UNSIGNED not NULL,
Location_ID int UNSIGNED not NULL,
primary key (Company_ID,Location_ID),
foreign key(Company_ID) references Company(Company_ID) on update cascade on delete cascade,
foreign key(Location_ID) references Location(Location_ID) on update cascade on delete cascade
);
create table Company_Industries (
Company_ID int UNSIGNED,
Industry_ID smallint UNSIGNED,
primary key (Company_ID,Industry_ID),
foreign key(Company_ID) references Company(Company_ID) on update cascade on delete cascade,
foreign key(Industry_ID) references Catalog_Industries(Industry_ID) on update cascade on delete cascade
);

## User: 4
create table User_ (
User_ID int UNSIGNED auto_increment,
username varchar(64) unique,
email varchar(128) unique,
pass varchar(128),
Role_ID tinyint,
primary key (User_ID),
foreign key(Role_ID) references Catalog_role(Role_ID) on update cascade on delete cascade
);
create table Admin_ (
Admin_ID int UNSIGNED,
avatar varchar(256) unique,
primary key (Admin_ID),
foreign key(Admin_ID) references User_(User_ID) on update cascade on delete cascade
);
create table Employer (
Employer_ID int UNSIGNED,
Company_ID int UNSIGNED,
Status_ bool, 
primary key (Employer_ID),
foreign key(Employer_ID) references User_(User_ID) on update cascade on delete cascade,
foreign key(Company_ID) references Company(Company_ID) on update cascade on delete cascade
);

drop table if exists Jobseeker; 
create table Jobseeker (
Jobseeker_ID int UNSIGNED,
avatar varchar(256) unique,
Status_ bool,
primary key (Jobseeker_ID),
foreign key(Jobseeker_ID) references User_(User_ID) on update cascade on delete cascade
);

## Profile: 6
drop table if exists Profile_jobseeker;
create table Profile_jobseeker (
Profile_ID int UNSIGNED,
last_name varchar(64),
first_name varchar(64),
gender ENUM('Nam', 'Nữ') NULL,
Birthday date,
avatar varchar(128),
Career_target varchar(256),
Title varchar(256),
Marital_status ENUM('Độc thân', 'Đã kết hôn') NULL,
Nationality smallint UNSIGNED,
Level_ID smallint UNSIGNED,
Job_function_ID smallint UNSIGNED,
Nation_ID smallint UNSIGNED,
City_ID smallint UNSIGNED,
District_ID smallint UNSIGNED,
Street varchar(128),
primary key (Profile_ID),
foreign key(Profile_ID) references Jobseeker(Jobseeker_ID) on update cascade on delete cascade,
foreign key(Level_ID) references Catalog_level(Level_ID) on update cascade on delete cascade,
foreign key(Job_function_ID) references Catalog_Job_function(Job_function_ID) on update cascade on delete cascade,
foreign key(Nationality) references Catalog_Nation(Nation_ID) on update cascade on delete cascade,
foreign key(Nation_ID) references Catalog_Nation(Nation_ID) on update cascade on delete cascade,
foreign key(City_ID) references Catalog_City(City_ID) on update cascade on delete cascade,
foreign key(District_ID) references Catalog_District(District_ID) on update cascade on delete cascade
);

create table Profile_Certification (
Profile_ID int UNSIGNED,
Certifications varchar(128) ,
primary key (Profile_ID,Certifications),
foreign key(Profile_ID) references Profile_jobseeker(Profile_ID) on update cascade on delete cascade
);
create table Profile_Education (
Profile_ID int UNSIGNED,
Education_ID smallint UNSIGNED,
Situation varchar(128),
primary key (Profile_ID,Education_ID),
foreign key(Profile_ID) references Profile_jobseeker(Profile_ID) on update cascade on delete cascade,
foreign key(Education_ID) references Catalog_Education(Education_ID) on update cascade on delete cascade
);
create table Profile_Skill (
Profile_ID int UNSIGNED,
Skill varchar(128) ,
primary key (Profile_ID,Skill),
foreign key(Profile_ID) references Profile_jobseeker(Profile_ID) on update cascade on delete cascade
);
create table Profile_Experience (
Profile_ID int UNSIGNED,
Experience varchar(256) ,
primary key (Profile_ID,Experience),
foreign key(Profile_ID) references Profile_jobseeker(Profile_ID) on update cascade on delete cascade
);
create table CV_of_Jobseeker (
Jobseeker_ID int UNSIGNED,
CV_ID tinyint,
CV varchar(128),
primary key (Jobseeker_ID,CV_ID),
foreign key(Jobseeker_ID) references Jobseeker(Jobseeker_ID) on update cascade on delete cascade
);

## Messenger: 1
create table Messenger (
Messenger_ID bigint,
Sender_ID int UNSIGNED,
Receiver_ID int UNSIGNED,
Date_time date,
Content text,
primary key (Messenger_ID),
foreign key(Sender_ID) references User_(User_ID) on update cascade on delete cascade,
foreign key(Receiver_ID) references User_(User_ID) on update cascade on delete cascade
);

## Job: 8

create table Job (
Job_ID bigint unsigned,
Employer_ID int UNSIGNED NOT NULL,
Title varchar(128) not null,
Date_post date not null,
Date_expi date not null,
Status_ bool not null,
Industries smallint unsigned null,
Job_function_ID smallint unsigned not null,
Location_ID int UNSIGNED not null,
Working_type tinyint not null,
Quantity tinyint not null,
Describle text not null,
Views smallint unsigned not null,
 ##
Salary_max int unsigned,
Salary_min int unsigned,
Level_ID smallint unsigned,
Require_Marital_Status_ ENUM('Độc thân', 'Đã kết hôn') NULL,
Require_gender ENUM('Nam', 'Nữ') NULL,
Require_age tinyint,
Education_At_Least smallint UNSIGNED,  
primary key (Job_ID),
foreign key(Employer_ID) references Employer(Employer_ID) on update cascade on delete cascade,
foreign key(Job_function_ID) references Catalog_Job_function(Job_function_ID) on update cascade on delete cascade,
foreign key(Industries) references Catalog_Industries(Industry_ID) on update cascade on delete set null,
foreign key(Location_ID) references Location(Location_ID) on update cascade on delete cascade,
foreign key(Level_ID) references Catalog_level(Level_ID) on update cascade on delete cascade,
foreign key(Education_At_Least) references Catalog_Education(Education_ID ) on update cascade on delete set null,
foreign key(Working_type) references Catalog_working_type(working_type_ID ) on update cascade on delete set null
);

create table Job_woking_time (
Job_ID bigint UNSIGNED,
Dayofweek tinyint,
Time_start time,
Time_end time,
primary key (Job_ID,Dayofweek),
foreign key(Job_ID) references Job(Job_ID) on update cascade on delete cascade
);
create table Job_Require_Skills (
Job_ID bigint UNSIGNED,
Skill varchar(128),
primary key (Job_ID,Skill),
foreign key(Job_ID) references Job(Job_ID) on update cascade on delete cascade
);
create table Job_Require_Certification (
Job_ID bigint UNSIGNED,
Certification varchar(128) ,
primary key (Job_ID,Certification),
foreign key(Job_ID) references Job(Job_ID) on update cascade on delete cascade
);

create table Job_Require_Language (
Job_ID bigint UNSIGNED,
Language_ID smallint UNSIGNED,
Language_metric varchar(64),
metric_require smallint unsigned,
primary key (Job_ID,Language_ID),
foreign key(Job_ID) references Job(Job_ID) on update cascade on delete cascade,
foreign key(Language_ID) references Catalog_language(Language_ID) on update cascade on delete cascade
);
create table Job_Benefit (
Job_ID bigint UNSIGNED,
Benefit_ID smallint UNSIGNED,
Benefit_value tinyint,
primary key (Job_ID,Benefit_ID),
foreign key(Job_ID) references Job(Job_ID) on update cascade on delete cascade,
foreign key(Benefit_ID) references Catalog_benefit(Benefit_ID) on update cascade on delete cascade
);
create table Job_Tags (
Job_ID bigint UNSIGNED,
Tags varchar(128),
primary key (Job_ID,Tags),
foreign key(Job_ID) references Job(Job_ID) on update cascade on delete cascade
);
create table Jobseeker_Apply_Job (
Jobseeker_ID int unsigned,
Job_ID bigint UNSIGNED,
Date_appy date,
primary key (Jobseeker_ID,Job_ID),
foreign key(Jobseeker_ID) references Jobseeker(Jobseeker_ID) on update cascade on delete cascade,
foreign key(Job_ID) references Job(Job_ID) on update cascade on delete cascade
);

## Career_Path: 6
create table Career_State (
Career_Path_ID int unsigned,
State_ID tinyint,
Step tinyint,
Salary_expect int UNSIGNED,
Level_ID smallint UNSIGNED,
primary key (Career_Path_ID,State_ID),
foreign key(Level_ID) references Catalog_level(Level_ID) on update cascade on delete cascade,
foreign key(Career_Path_ID) references jobseeker(Jobseeker_ID) on update cascade on delete cascade
);
create table Career_path (
Career_Path_ID int unsigned,
Current_State_ID tinyint,
primary key (Career_Path_ID),
foreign key(Career_Path_ID,Current_State_ID) references Career_State(Career_Path_ID,State_ID) on update cascade on delete cascade
);
create table State_Require_Skill (
Career_Path_ID int unsigned,
State_ID tinyint,
Skill_ID int unsigned,
primary key (Career_Path_ID,State_ID),
foreign key(Career_Path_ID) references Career_path(Career_Path_ID) on update cascade on delete cascade
);
create table State_Require_Experience (
Career_Path_ID int unsigned,
State_ID tinyint,
Experience varchar(128),
primary key (Career_Path_ID,State_ID),
foreign key(Career_Path_ID) references Career_path(Career_Path_ID) on update cascade on delete cascade
);
create table State_Require_Certification (
Career_Path_ID int unsigned,
State_ID tinyint,
Certification varchar(128) ,
primary key (Career_Path_ID,State_ID),
foreign key(Career_Path_ID) references Career_path(Career_Path_ID) on update cascade on delete cascade
);
create table Career_path_NextStep_Requirement (
Career_Path_ID int unsigned,
Requirement varchar(128) ,
primary key (Career_Path_ID,Requirement),
foreign key(Career_Path_ID) references Career_path(Career_Path_ID) on update cascade on delete cascade
);

## table of relation: 5
create table Review (
Jobseeker_ID int UNSIGNED,
Company_ID int UNSIGNED,
Date_time datetime,
Score smallint, 
Content text,
primary key (Jobseeker_ID, Company_ID),
foreign key(Jobseeker_ID) references Jobseeker(Jobseeker_ID) on update cascade on delete cascade,
foreign key(Company_ID) references Company(Company_ID) on update cascade on delete cascade
);
create table Employer_Rate_Jobseeker (
Employer_ID int UNSIGNED,
Jobseeker_ID int UNSIGNED,
Score smallint, 
primary key (Employer_ID,Jobseeker_ID),
foreign key(Jobseeker_ID) references Jobseeker(Jobseeker_ID) on update cascade on delete cascade,
foreign key(Employer_ID) references Employer(Employer_ID) on update cascade on delete cascade
);
create table Employer_Save_Jobseeker (
Employer_ID int UNSIGNED,
Jobseeker_ID int UNSIGNED,
primary key (Employer_ID,Jobseeker_ID),
foreign key(Employer_ID) references Employer(Employer_ID) on update cascade on delete cascade,
foreign key(Jobseeker_ID) references Jobseeker(Jobseeker_ID) on update cascade on delete cascade
);
create table Jobseeker_Follow_Employer (
Jobseeker_ID int UNSIGNED,
Employer_ID int UNSIGNED,
primary key (Jobseeker_ID,Employer_ID),
foreign key(Employer_ID) references Employer(Employer_ID) on update cascade on delete cascade,
foreign key(Jobseeker_ID) references Jobseeker(Jobseeker_ID) on update cascade on delete cascade
);
create table Jobseeker_Save_Job (
Jobseeker_ID int UNSIGNED,
Job_ID bigint UNSIGNED,
primary key (Jobseeker_ID,Job_ID),
foreign key(Job_ID) references Job(Job_ID) on update cascade on delete cascade,
foreign key(Jobseeker_ID) references Jobseeker(Jobseeker_ID) on update cascade on delete cascade
);


## table of backup




## table of setting
