// getOpsSavingsPlanInfo.js
// Purpose: Fetch Savings Plan thru Strategy Plan

const express = require('express');
const sql = require('mssql');
const router = express.Router();


// Route: Handle POST request 
router.post('/getOpsSavingsPlanInfo', async (req, res) => {
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
    const result = await request.execute('UI_Ops_Savings_Plan_Info');

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