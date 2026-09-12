const express = require('express');
const sql = require('mssql');
const router = express.Router();

// Update Strategy Plan decisions
router.post('/updateStrategyPlan', async (req, res) => {
  const strategyPlans = req.body;

  try {
    if (!Array.isArray(strategyPlans) || strategyPlans.length === 0) {
      return res.status(400).json({
        SucValue: 1,
        Out_Message: 'Strategy Plan is NOT received ! '
      });
    }

    const results = [];

    for (const plan of strategyPlans) {
      const request = new sql.Request();

      request.input('Game_Id', sql.NVarChar, plan.gameId);
      request.input('Game_Batch', sql.SmallInt, plan.gameBatch);
      request.input('Game_Team', sql.NVarChar, plan.gameTeam);
      request.input('Strategy_Set_No', sql.SmallInt, plan.strategySetNo);
      request.input('Strategy_Id', sql.NVarChar, plan.strategyId);
      request.input('Player_Decision', sql.NVarChar, plan.playerDecision);
      request.input('Decided_by', sql.NVarChar, plan.decidedBy);

      request.output('SucValue', sql.Int);
      request.output('Out_Message', sql.NVarChar(200));

      const result = await request.execute('UI_Strategy_Plan_Trans');

      results.push({
        data: result.recordset || [],
        SucValue: result.output?.SucValue,
        Out_Message: result.output?.Out_Message
      });
    }

    res.json(results);
  } catch (err) {
    console.error('Update Strategy Plan failed:', err);

    res.status(500).json({
      SucValue: -1,
      Out_Message: err.message
    });
  }
});

module.exports = router;