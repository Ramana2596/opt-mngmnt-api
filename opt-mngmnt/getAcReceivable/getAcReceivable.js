// ============================================================
// API Name : getAcReceivable
// Purpose  : Fetch Account Receivable
// ============================================================

const express = require('express');
const sql = require('mssql');
const router = express.Router();

// Route: Handle GET request
router.get('/getAcReceivable', async (req, res) => {
  try {
    // Extract parameters from query string
    const { gameId, gameBatch, gameTeam } = req.query;

    // Validate mandatory parameters
    if (!gameId || !gameBatch || !gameTeam) {
      return res.status(400).send('Missing Parameters !');
    }

    // Validate data type
    if (!Number.isInteger(Number(gameBatch))) {
      return res.status(400).send('Batch must be an integer !');
    }

    // Create request and map parameters (SP vs frontend)
    const request = new sql.Request();
    request.input('Game_Id', sql.NVarChar, String(gameId));
    request.input('Game_Batch', sql.Int, Number(gameBatch));
    request.input('Game_Team', sql.NVarChar, String(gameTeam));

    // Execute stored procedure
    const result = await request.execute('UI_Ac_Receivable');

    // Return rows
    res.json(result.recordset);

  } catch (err) {
    // DB / system error
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;