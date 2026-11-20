// getClassRoomSession.js
// Purpose: Get Class Room Session information of a Team

const express = require('express');
const sql = require('mssql');
const router = express.Router();


router.get('/getClassRoomSession', async (req, res) => {
  try {

    const { gameId, gameBatch} = req.query;

    // Check if parameters exist
    if (!gameId || !gameBatch ) {
      return res.status(400).json({
        success: false,
        message: 'Missing parameter !.'
      });
    }
    
    const request = new sql.Request();

    // pass parameters to stored procedure
    request.input('Game_Id', sql.NVarChar(20), req.query.gameId || null);
    request.input('Game_Batch', sql.Int, parseInt(req.query.gameBatch) || null);

    // Execute the stored procedure and return the result
    const result = await request.execute('dbo.UI_Class_Room_Session');
    res.json(result.recordset);

  } catch (err) {
    // Catch error at API call level and log to console
    console.error('Query failed:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
