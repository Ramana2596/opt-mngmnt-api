// updateSimulationPlay.js
// Purpose: Executes SP: UI_Simulation_Centre 

const express = require('express');
const sql = require('mssql');
const router = express.Router();


// Route: Handle POST request 
router.post('/updateSimulationPlay', async (req, res) => {
  try {
    // Extract parameters from payload
    const { gameId, gameBatch, gameTeam, currentStage, currentPeriod, cmdLine } = req.body;

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
    request.input('CMD_Line', sql.NVarChar, req?.body?.cmdLine || null);

    // --- Define Output Parameter ---
    request.output('SucValue', sql.Int);
    request.output('Out_Message', sql.NVarChar(200));

    // Execute stored procedure
    const result = await request.execute('UI_Simulation_Centre');

    // Extract SP return values
    const returnValue = result.output?.SucValue ?? -1;
    const message = result?.output?.Out_Message ?? '';
    const data = result.recordset || [];

    // Execution response
    res.json({ returnValue, message, data });

  } catch (err) {
    // DB / system error during SP execution
    console.error('SQL Error:', err);
    res.status(500).json({ returnValue: -1, message: err.message });
  }
});

module.exports = router;