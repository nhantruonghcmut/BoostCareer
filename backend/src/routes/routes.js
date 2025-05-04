const express = require("express");

const authencationRoutes = require("./authencationRoutes.js");
const categoryRoutes = require("./categoryRoutes.js");
const jobseekerRoutes = require("./jobseekerRoutes.js");
const employerRoutes = require("./employerRoutes.js");
const guestRoutes = require("./guestRoutes.js");
const AIRoutes = require("./openAIRoutes.js");


const routes = express();
routes.use("/category", categoryRoutes);
routes.use("/auth", authencationRoutes);
routes.use("/jobseeker", jobseekerRoutes);
routes.use("/employer", employerRoutes);
routes.use("/guest", guestRoutes);
routes.use("/AIservice", AIRoutes);


module.exports = routes;
