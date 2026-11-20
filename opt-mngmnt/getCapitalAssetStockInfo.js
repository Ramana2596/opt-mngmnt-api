// file: getCapitalAssetStockInfo.js
// Purpose: Get Capital Asset Stock info - Initial info or specific to a team

const express = require('express');
const sql = require('mssql');
const router = express.Router();

router.get('/getCapitalAssetStockInfo', async (req, res) => {
  try {
    const { gameId, gameBatch, gameTeam } = req.query;

    // Check if parameters exist
    if (!gameId) {
      return res.status(400).json({
        success: false,
        message: 'Missing parameter !.'
      });
    }

    const request = new sql.Request();

    // Pass Parameters to stored procedure
    request.input('Game_Id', sql.NVarChar(20), req.query.gameId || null);
    request.input('Game_Batch', sql.Int, parseInt(req.query.gameBatch) || null);
    request.input('Game_Team', sql.NVarChar(20), req.query.gameTeam || null);


    const result = await request.execute('dbo.UI_Capital_Asset_Stock_Info');
    res.json(result.recordset);

  } catch (err) {
    // Catch error at API call level and log to console
    console.error('Query failed:', err);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;    