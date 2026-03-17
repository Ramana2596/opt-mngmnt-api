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
    request.output('Out_Message', sql.NVarChar(200));

    // Execute stored procedure
    const result = await request.execute('UI_Simulation_Centre');

    // Extract SP return values
    const returnValue = result.returnValue ?? -1;
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


/*
* API Name   : updateSimulationPlay.js
const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

// -----------------------------------------------
// POST: /updateSimulationPlay
// -----------------------------------------------
sql.connect(dbConfig).then(() => {
    router.post('/updateSimulationPlay', async (req, res) => {
      // Validate required field
      if (!req?.body?.cmdLine) {
        return res.status(400).json({
          success: false,
          returnValue: 1,
          message: 'CMD_Line is required',
        });
      } 
      try {
        // Create SQL request
        const request = new sql.Request();
        
        // --- Define Input Parameters (match SP signature) ---
        request.input('Game_Id', sql.NVarChar, req?.body?.gameId || null);
        request.input('Game_Batch', sql.Int, parseInt(req?.body?.gameBatch) || null);
        request.input('Game_Team', sql.NVarChar, req?.body?.gameTeam || null);
        request.input('CMD_Line', sql.NVarChar, req?.body?.cmdLine || null);
      
        // --- Define Output Parameter ---
        request.output('Out_Message', sql.NVarChar(200));

        // --- Execute Stored Procedure ---
        const result = await request.execute('UI_Simulation_Centre');
        console.log('Stored procedure result:', result);
    
        // --- Extract values ---
        const message = result.output?.Out_Message || 'No message returned.';
        const returnValue = result.returnValue ?? -1; // SP return (0, 1, -1)

        // --- Standard JSON Response ---
        res.json({
          success: returnValue === 0, // true if SP success
          returnValue,
          message,
        });
    
      } catch (err) {
        console.error('SQL Error:', err);
        res.status(500).json({
          success: false,
          returnValue: -1,    // System/DB or network error
          message: 'Internal server error',
          error: err.message
        });
      }
    });
});

*/