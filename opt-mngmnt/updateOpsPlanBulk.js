// Path: opt-mngmnt/updateOpsPlanBulk.js
/**
 * API Name   : updateOpsPlanBulk.js
 * Purpose    : Bulk update Operations Plan using [UI_Ops_Business_Plan_Bulk] SP
 * Input      : rows (array of ops plan rows), userId
 * Output     : @Out_Message from SP, success/failure indicator
 */

const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

// -----------------------------------------------
// POST: /updateOpsPlanBulk
// -----------------------------------------------
sql.connect(dbConfig).then(() => {
  router.post('/updateOpsPlanBulk', async (req, res) => {

    // ---- Validate required fields ----
    const { rows, userId } = req.body;
    if (!rows || rows.length === 0) {
      return res.status(400).json({
        success: false,
        returnValue: 1,
        message: 'No rows to update',
      });
    }

    try {
      // ---- Create SQL request ----
      const request = new sql.Request();

      // ---- Create TVP matching OpsPlan_BulkType (correct types) ----
      const tvp = new sql.Table("dbo.OpsPlan_BulkType");
      tvp.columns.add("Game_Id", sql.NVarChar(20));
      tvp.columns.add("Game_Batch", sql.Int);
      tvp.columns.add("Game_Team", sql.NVarChar(10));
      tvp.columns.add("Production_Month", sql.Date);
      tvp.columns.add("Operations_Input_Id", sql.NVarChar(10));
      tvp.columns.add("Part_No", sql.NVarChar(10));
      tvp.columns.add("Quantity_Id", sql.NVarChar(5));
      tvp.columns.add("Quantity", sql.Decimal(10, 2));
      tvp.columns.add("Price_Id", sql.NVarChar(5));
      tvp.columns.add("Unit_Price", sql.Decimal(6, 2));

      // ---- Populate TVP rows from frontend payload ----
      rows.forEach((r, idx) => {
        console.log(`Row ${idx}:`, r);
        tvp.rows.add(
          r.Game_Id,
          r.Game_Batch,
          r.Game_Team,
          r.Production_Month,
          r.Operations_Input_Id,
          r.Part_No,
          r.Quantity_Id,
          parseFloat(r.Quantity) || 0,
          r.Price_Id,
          parseFloat(r.Unit_Price) || 0
        );
      });


      // ---- Define SP Input/Output Parameters ----
      request.input('OpsPlanRows', tvp); // TVP input
      request.input('UserId', sql.NVarChar(50), userId || "Team_Leader");
      request.output('Out_Message', sql.NVarChar(200));

      // ---- Execute Stored Procedure ----
      const result = await request.execute('UI_Ops_Business_Plan_Bulk');

      // ---- Extract SP return values ----
      const message = result.output?.Out_Message || 'No message returned.';
      const returnValue = result.returnValue ?? -1;

      // ---- Standard JSON Response ----
      res.json({
        success: returnValue === 0,
        returnValue,
        message
      });

    } catch (err) {
      console.error('SQL Error:', err);

      // ---- Standard error response ----
      res.status(500).json({
        success: false,
        returnValue: -1,
        message: 'Internal server error',
        error: err.message
      });
    }

  });
});

module.exports = router;
