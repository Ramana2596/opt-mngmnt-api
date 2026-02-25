// getProductionInfo.js
// Updated to map Parameters and datatypes

/*
const express = require('express');
const sql = require('mssql');
const dbConfig = require('../../dbConfig');
const router = express.Router();

sql.connect(dbConfig).then(() => {
  router.get('/getProductionInfo', async (req, res) => {
    try {
        const request = new sql.Request();

        // Add parameters
        request.input('Game_Id', sql.NVarChar, req.query.gameId || null);
        request.input('Game_Batch', sql.Int, parseInt(req.query.gameBatch) || null);
        request.input('Game_Team', sql.NVarChar, req.query.gameTeam || null);

        const result = await request.execute('UI_Production_Record_Info');
        res.json(result.recordset);
    } catch (err) {
      console.error('Query failed:', err);
      res.status(500).send('Internal Server Error');
    }   });
});

*/

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
router.post('/getProductionInfo', async (req, res) => {
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

    // Reuse global pool
    const request = new sql.Request();

    // SP input parameters
    request.input('Game_Id', sql.NVarChar(20), gameId);
    request.input('Game_Batch', sql.Int, Number(gameBatch));
    request.input('Game_Team', sql.NVarChar(10), gameTeam);
    request.input('Production_Month', sql.Date, productionMonth || null); 

    // Execute stored procedure
    const result = await request.execute('UI_Production_Record_Info');

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
