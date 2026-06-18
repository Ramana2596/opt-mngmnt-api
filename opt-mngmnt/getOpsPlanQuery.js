// getOpsPlanQuery.js

const express = require("express");
const sql = require("mssql");
const router = express.Router();

// Route: POST /api/getOpsPlanQuery
router.post("/getOpsPlanQuery", async (req, res) => {
  try {
    const request = new sql.Request();

    // Normalize Production_Month to yyyy-mm-dd (no timestamp)
    let prodMonth = null;
    if (req.body.productionMonth) {
      prodMonth = new Date(req.body.productionMonth).toISOString().split("T")[0];
    }

    // Map body params directly to SQL inputs
    request.input("Game_Id", sql.NVarChar, req.body.gameId || "OpsMgt");
    request.input("Game_Batch", sql.Int, req.body.gameBatch); 
    request.input("Game_Team", sql.NVarChar, req.body.gameTeam || null);
    request.input("Production_Month", sql.Date, prodMonth);
    request.input("Operations_Input_Id", sql.NVarChar, req.body.operationsInputId || null);
    request.input("Part_No", sql.NVarChar, req.body.partNo || null);
    request.input("Required_Quantity", sql.SmallInt, req.body.requiredQuantity);
    request.input("CMD_Line", sql.NVarChar, req.body.cmdLine || null);

    // Execute stored procedure
    const result = await request.execute("UI_Ops_Business_Plan_Query");

    // Return raw recordset
    res.json(result.recordset || []);
  } catch (err) {
    console.error("Query failed:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
