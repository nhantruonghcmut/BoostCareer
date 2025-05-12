const express = require("express");

const Routes_authencation = require("./Routes_authencation.js");
const Routes_category = require("./Routes_category.js");
const Routes_job = require("./Routes_job.js");
const Routes_employer = require("./Routes_employer.js");
const Routes_jobseeker = require("./Routes_jobseeker.js");
const Routes_backup = require("./Routes_backup.js");
const Routes_message = require("./Routes_message.js");
const Routes_dashboard = require("./Routes_dashboard.js");


const routes = express();

routes.use("/api/auth", Routes_authencation);
routes.use("/api/category", Routes_category);
routes.use("/api/job", Routes_job);
routes.use("/api/employer", Routes_employer);
routes.use("/api/jobseeker", Routes_jobseeker);
routes.use("/api/backup", Routes_backup);
routes.use("/api/message", Routes_message);
routes.use("/api/dashboard", Routes_dashboard);


module.exports = routes;
