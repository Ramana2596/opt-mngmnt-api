
// Updated for correct data types format for parameters
const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

// API Call to get Market Info of a Team as per its progress
sql.connect(dbConfig).then(() => {
  router.get('/getMarketInfoTeam', async (req, res) => {
    try {
        const request = new sql.Request();

        // Add parameters
        request.input('Game_Id', sql.NVarChar(20), req.query.gameId || null);
        request.input('Game_Batch', sql.Int, parseInt(req.query.gameBatch) || null);
        request.input('Game_Team', sql.NVarChar(20), req.query.gameTeam || null);

        const result = await request.execute('dbo.UI_Market_Info_Team');
        res.json(result.recordset);
    } catch (err) {
      console.error('Query failed:', err);
      res.status(500).send('Internal Server Error');
    }   });
});

module.exports = router;