// getOpsDemandCreationInfo.js
// Purpose: Fetch Demand Created due to Strategy

const express = require('express');
const sql = require('mssql');
const router = express.Router();


// Route: Handle POST request 
router.get('/getOpsDemandCreationInfo', async (req, res) => {
  try {
    // Extract parameters from payload
    const { gameId, gameBatch, gameTeam } = req.query || {};

    // Validate mandatory parameters
    if (!gameId || !gameBatch || !gameTeam) {
      return res.status(400).send('Missing Parameter');
    }
    // Validate parameter type
    if (!Number.isInteger(Number(gameBatch))) {
      return res.status(400).send('Batch must be integer');
    }

    // Create request 
    const request = new sql.Request();

    // Map Parameters and datatypes SP Vs frontend
    request.input('Game_Id', sql.NVarChar(20), gameId);
    request.input('Game_Batch', sql.Int, Number(gameBatch));
    request.input('Game_Team', sql.NVarChar(10), gameTeam);

    // Execute stored procedure
    const result = await request.execute('UI_Ops_Demand_Creation_Info');
    res.json(result.recordset || []);

  } catch (err) {
    // Catch error at API call level and log to console
    console.error('SQL Error:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;