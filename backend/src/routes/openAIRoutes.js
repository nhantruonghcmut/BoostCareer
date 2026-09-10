import express from "express";
import {
    scorematching,
    analyzeProfile
} from "../controllers/aiControllers.js";
import { verifyToken, verifyRole } from '../middlewares/authMiddleware.js';
import { aiLimiter } from '../config/security.js';
const setLongTimeout = (req, res, next) => {
    // Thiết lập timeout lên 60 giây (hoặc dài hơn) cho route này
    req.setTimeout(30000);
    res.setTimeout(30000);
    next();
  };
  
const openAI = express.Router();
// openAI.use(verifyToken);
// openAI.use(verifyRole(3));
openAI.get("/analyze", verifyToken, verifyRole(3), aiLimiter, setLongTimeout, analyzeProfile);
openAI.get("/score-matching", verifyToken, verifyRole(3), aiLimiter, scorematching);
export default openAI;








