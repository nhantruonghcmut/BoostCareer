const express = require("express");
const {
    scorematching,
    analyzeProfile
} = require("../controllers/aiControllers.js");
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');
const setLongTimeout = (req, res, next) => {
    // Thiết lập timeout lên 60 giây (hoặc dài hơn) cho route này
    req.setTimeout(30000);
    res.setTimeout(30000);
    next();
  };
  
const openAI = express.Router();
// openAI.use(verifyToken);
// openAI.use(verifyRole(3));
openAI.get("/analyze",verifyToken, verifyRole(3), setLongTimeout, analyzeProfile);
openAI.get("/score-matching",verifyToken, verifyRole(3), scorematching);
module.exports = openAI;








