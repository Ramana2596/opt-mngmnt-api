// getPlantCapacity.js
// Two Response Sets: Work_Centre and plant capacity, Load & Utilisation
const express = require('express');
const sql = require('mssql');
const router = express.Router();

// Route: GET /getPlantCapacity
router.get('/getPlantCapacity', async (req, res) => {
  try {
    const request = new sql.Request();

    // Parameters (typed correctly)
    request.input('Game_Id', sql.NVarChar(20), req.query.gameId || null);
    request.input('Game_Batch',sql.Int, req.query.gameBatch ? parseInt(req.query.gameBatch, 10) : null);
    request.input('Game_Team', sql.NVarChar(20), req.query.gameTeam || null);
    request.input('Production_Month', sql.Date, req.query.productionMonth || null);

    // Execute stored procedure
    const result = await request.execute('dbo.UI_Plant_Capacity_Info');

    // Two responses: Work_Centre and plant capacity, Load & Utilisation
    res.json({
      Work_Centre: result.recordsets[0] || [],
      Plant: result.recordsets[1] || [],
    });

  } catch (err) {
    console.error('Query failed:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
