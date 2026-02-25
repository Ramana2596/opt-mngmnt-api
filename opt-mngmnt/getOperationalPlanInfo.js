/*
const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

sql.connect(dbConfig).then(() => {
    router.get('/getOperationalPlanInfo', async (req, res) => {
            try {
                const result = await sql.query(`
   EXEC [dbo].[UI_Ops_Business_Plan_Info] 
        @Game_Id = '${req.query.gameId}',
        @Game_Batch = ${req.query.gameBatch},
        @Game_Team = '${req.query.gameTeam}',
        @CMD_Line = 'Operation_Plan'`);
                res.json(result.recordset);
            } catch (err) {
                console.error('Query failed:', err);
                res.status(500).send('Internal Server Error');
            }
    });
});
*/


// getOperationalPlanInfo.js
// Purpose: Operational Plan Info

const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');

const router = express.Router();

// DB connection ONCE at app startup (global pool reused)
sql.connect(dbConfig).then(() => {
  console.log('DB connected successfully');
}).catch(err => {
  console.error('DB Connection Failed:', err);
});

// Route: Handle POST request
router.post('/getOperationalPlanInfo', async (req, res) => {
  try {
    // Extract parameters from payload
    const { gameId, gameBatch, gameTeam, productionMonth,cmdLine } = req.body.params || {};

    // Validate mandatory parameters
    if (!gameId || !gameBatch || !gameTeam || !cmdLine) {
      return res.status(400).json({
        success: false,
        code: -1,
        message: "Missing Parameter",
      });
    }

    // Reuse global pool
    const request = new sql.Request();

    // Map Parameters and datatypes SP Vs frontend
    request.input('Game_Id', sql.NVarChar(20), gameId);
    request.input('Game_Batch', sql.Int, Number(gameBatch));
    request.input('Game_Team', sql.NVarChar(10), gameTeam);
    request.input('Production_Month', sql.Date, productionMonth || null); 
    request.input('CMD_Line', sql.NVarChar(200), cmdLine);  // Operation_Plan

    // Execute stored procedure
    const result = await request.execute('UI_Ops_Business_Plan_Info');

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

