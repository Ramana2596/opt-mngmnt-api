// getOpsPlanQuery.js

const express = require("express");
const sql = require("mssql");
const dbConfig = require("../dbConfig");
const router = express.Router();

sql.connect(dbConfig).then(() => {
  router.get("/getOpsPlanQuery", async (req, res) => {
    try {
      const request = new sql.Request();

      // Map camelCase query params to PascalCase SQL inputs
      request.input("Game_Id", sql.NVarChar, req.query.gameId || null);
      request.input("Game_Batch", sql.Int, parseInt(req.query.gameBatch) || null);
      request.input("Game_Team", sql.NVarChar, req.query.gameTeam || null);
      request.input("Production_Month", sql.Date, req.query.productionMonth || null);
      request.input("Operations_Input_Id", sql.NVarChar, req.query.operationsInputId || null);
      request.input("Ref_Type_Info", sql.NVarChar, req.query.refTypeInfo || null);
      request.input("Ref_Type_Price", sql.NVarChar, req.query.refTypePrice || null);
      request.input("Quantity_Id", sql.NVarChar, req.query.quantityId || null);
      request.input("Price_Id", sql.NVarChar, req.query.priceId || null);
      request.input("CMD_Line", sql.NVarChar, req.query.cmdLine || null);

      const result = await request.execute("UI_Ops_Business_Plan_Query");

      // Return raw recordset
      res.json(result.recordset || []);
    } catch (err) {
      console.error("Query failed:", err);
      res.status(500).send("Internal Server Error");
    }
  });
});

module.exports = router;
