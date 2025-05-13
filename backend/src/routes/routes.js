const express = require("express");
const authencationRoutes = require("./authencationRoutes.js");
const categoryRoutes = require("./categoryRoutes.js");
const jobseekerRoutes = require("./jobseekerRoutes.js");
const employerRoutes = require("./employerRoutes.js");
const guestRoutes = require("./guestRoutes.js");
const AIRoutes = require("./openAIRoutes.js");


const routes = express();
routes.use("/api/category", categoryRoutes);
routes.use("/api/auth", authencationRoutes);
routes.use("/api/jobseeker", jobseekerRoutes);
routes.use("/api/employer", employerRoutes);
routes.use("/api/guest", guestRoutes);
routes.use("/api/AIservice", AIRoutes);


module.exports = routes;
