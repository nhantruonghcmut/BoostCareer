import express from "express";
import authencationRoutes from "./authencationRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import jobseekerRoutes from "./jobseekerRoutes.js";
import employerRoutes from "./employerRoutes.js";
import guestRoutes from "./guestRoutes.js";
import AIRoutes from "./openAIRoutes.js";
// import crawRoutes from "./crawRoutes.js";


const routes = express();
routes.use("/api/category", categoryRoutes);
routes.use("/api/auth", authencationRoutes);
routes.use("/api/jobseeker", jobseekerRoutes);
routes.use("/api/employer", employerRoutes);
routes.use("/api/guest", guestRoutes);
routes.use("/api/AIservice", AIRoutes);
// routes.use("/api/craw", crawRoutes);

export default routes;
