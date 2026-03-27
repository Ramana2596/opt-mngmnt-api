// updateResetSimulation.js
// Purpose: Executes SP: Sim_Clean_Table for database cleanup
const express = require('express');
const sql = require('mssql');
const router = express.Router();

// Route: Handle POST request to reset simulation data
router.post('/updateResetSimulation', async (req, res) => {
  try {
    // Extraction: Pull parameters from the request payload
    const { gameId, gameBatch, gameTeam } = req.body;

    // Validation: Ensure all mandatory parameters are present
    if (!gameId || !gameBatch || !gameTeam) {
      return res.status(400).json({
        success: false,
        code: -1,
        message: "Missing Parameter",
      });
    }

    // Request: Initialize a new SQL command
    const request = new sql.Request();

    // Mapping: Link Frontend variables to SQL SP parameters
    request.input('Game_Id', sql.NVarChar(20), gameId);
    request.input('Game_Batch', sql.Int, Number(gameBatch));
    request.input('Game_Team', sql.NVarChar(10), gameTeam);

    // Execution: Run the stored procedure on the database
    const result = await request.execute('Sim_Clean_Table');

    // Response
    const returnValue = result.returnValue ?? 0;
    const message = returnValue === 0 ?
      "Simulation Reset successful !" :
      "Reset failed at database level !";
    const data = result.recordset || [];

    // Response: Send execution status and data back to caller
    res.json({ returnValue, message, data });

  } catch (err) {
    // Error: Handle SQL or System failures during execution
    console.error('SQL Error:', err);
    res.status(500).json({ returnValue: -1, message: "System error: " + err.message });
  }
});

module.exports = router;