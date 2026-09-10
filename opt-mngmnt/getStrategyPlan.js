const express = require('express');
const sql = require('mssql');
const router = express.Router();

router.get('/getStrategyPlan', async (req, res) => {
  try {
    const request = new sql.Request();

    request.input('Game_Id', sql.NVarChar, req.query.gameId || null);
    request.input('Game_Batch', sql.Int, parseInt(req.query.gameBatch) || null);
    request.input('Game_Team', sql.NVarChar, req.query.gameTeam || null);
    request.input('CMD_Line', sql.NVarChar, req.query.cmdLine || null);

    request.output('Out_Message', sql.NVarChar(200));

    const result = await request.execute('UI_Strategy_Plan_Query');

    res.json({
      data: result.recordset || [],
      Out_Message: result.output?.Out_Message || null,
      returnValue: result.returnValue,
    });
  } catch (err) {
    console.error('Query failed:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
