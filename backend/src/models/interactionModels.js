const { is } = require("express/lib/request.js");
const db = require("../config/databaseConfig.js");

const queryIncreaseView = async () => {
    try 
    {
        const [rows] = await db.query("SELECT * FROM catalog_industry;");
        return rows;
    }
    catch (error) {
        console.error("Error executing query:", error);
        throw error; // Rethrow the error to be handled by the calling function
    }
};




module.exports = {
    queryIncreaseView
};
