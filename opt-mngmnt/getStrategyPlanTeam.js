// getStrategyPlanTeam.js
// Purpose: Fetch Key Result Indicators from Balance Sheet data

const express = require('express');
const sql = require('mssql');
const router = express.Router();


// Route: Handle POST request for Balance Sheet Key Result Info
router.post('/getStrategyPlanTeam', async (req, res) => {
  try {
    // Extract parameters from payload
    const { gameId, gameBatch, gameTeam } = req.body.params || {};

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

    // Execute stored procedure
    const result = await request.execute('UI_Strategy_Plan_Team');

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
const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

sql.connect(dbConfig).then(() => {
    router.get('/getStrategyPlanTeam', async (req, res) => {
        try {
            const result = await sql.query(`
   EXEC [dbo].[UI_Strategy_Plan_Team] 
        @Game_Id = ${req?.query?.gameId ? `${req.query.gameId}` : 'NULL'},
        @Game_Batch = ${req?.query?.gameBatch ? req.query.gameBatch : 'NULL'},
        @Game_Team = ${req?.query?.gameTeam ? req.query.gameTeam : 'NULL'}
        `);
            res.json(result.recordset);
        } catch (err) {
            console.error('Query failed:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});
*/



