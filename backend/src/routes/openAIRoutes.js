const express = require("express");
const {
    compare,
} = require("../controllers/aiControllers.js");

const openAI = express.Router();
openAI.post("/score-matching", compare);
module.exports = openAI;








