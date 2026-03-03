// getBalanceSheeetInfo.js
// Purpose: Fetch Balance Sheet info

const express = require('express');
const sql = require('mssql');
const router = express.Router();


// Route: Handle POST request
router.post('/getBalanceSheetInfo', async (req, res) => {
  try {
    // Extract parameters from payload
    const { gameId, gameBatch, gameTeam, productionMonth } = req.body.params || {};

    // Validate mandatory parameters
    if (!gameId || !gameBatch || !gameTeam) {
      return res.status(400).json({
        success: false,
        code: -1,
        message: "Missing Parameter",
      });
    }

    // Create request 
    const request = new sql.Request();

    // Map Parameters and datatypes SP Vs frontend
      request.input('Game_Id', sql.NVarChar(20), gameId);
      request.input('Game_Batch', sql.Int, Number(gameBatch));
      request.input('Game_Team', sql.NVarChar(10), gameTeam);
      request.input(
          'Production_Month', sql.Date,
          productionMonth ? String(productionMonth).split('T')[0] : null
      );

    // Output Message
    request.output('Out_Message',sql.NVarChar(200));

    // Execute stored procedure
    const result = await request.execute('UI_Balance_Sheet_Dynamic');

    // Extract SP return values
    const code = result.returnValue ?? 0;
    const message = result?.output?.Out_Message ?? '';
    const data = result.recordset || [];

    // Successful execution response
    res.json({ success: true, code, message, data });

  } catch (err) {
    // DB / system error during SP execution
    console.error('SQL Error:', err);
    res.status(500).json({ success: false, code: -1, message: err.message });
  }
});

module.exports = router;



/*

// Updated for correct data types format for parameters
// to eliminate error in data conversion

const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

sql.connect(dbConfig).then(() => {
    router.get('/getBalanceSheetInfo', async (req, res) => {
        try {

            const request = new sql.Request();

            // Use correct data types based on SQL Server stored procedure
            request.input('Game_Id', sql.NVarChar, req.query.gameId || null);
            request.input('Game_Batch', sql.Int, parseInt(req.query.gameBatch || null));
            request.input('Game_Team', sql.NVarChar, req.query.gameTeam || null);

            const result = await request.execute('UI_Balance_Sheet_Info');

            res.json(result.recordset);
        } catch (err) {
            console.error('Query failed:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});
*/