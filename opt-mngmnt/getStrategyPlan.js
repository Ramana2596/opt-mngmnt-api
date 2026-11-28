// getStrategyPlan.js
// Purpose: Fetch Strategy Plan for form-use
// Std API Format - dbConfig, Parament & datatype check, response


const express = require('express');
const sql = require('mssql');
const router = express.Router();

router.get('/getStrategyPlan', async (req, res) => {
  try {

    const { gameId, gameBatch, gameTeam, cmdLine } = req.query;

    // Validate mandatory parameters
    if (!gameId || !gameBatch || !gameTeam || !cmdLine) {
      return res.status(400).send('Missing Parameter');
    }

    // Validate parameter type
    if (!Number.isInteger(Number(gameBatch))) {
      return res.status(400).send('Batch must be integer');
    }
    
    const request = new sql.Request();

    request.input('Game_Id', sql.NVarChar(20), gameId);
    request.input('Game_Batch', sql.Int, Number(gameBatch));
    request.input('Game_Team', sql.NVarChar(10), gameTeam);
    request.input('CMD_Line', sql.NVarChar(50), cmdLine);
 
    request.output('SucValue', sql.Int);
    request.output('Out_Message', sql.NVarChar(200));

    const result = await request.execute('UI_Strategy_Plan_Query');

    res.json({
      data: result.recordset || [],
      SucValue: result.output?.SucValue ?? -1,
      Out_Message: result.output?.Out_Message || null,
    });
  } catch (err) {
    console.error('Query failed:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
