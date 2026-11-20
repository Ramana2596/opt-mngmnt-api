// getChartInfo.js
// Purpose: Get Chart information of a Team

const express = require('express');
const sql = require('mssql');
const router = express.Router();

router.get('/getChartInfo', async (req, res) => {
    try {

    const { gameId, gameBatch, gameTeam, cmdLine} = req.query;

    // Check if parameters exist
    if (!gameId || !gameBatch || !gameTeam || !cmdLine) {
      return res.status(400).json({
        success: false,
        message: 'Missing parameter !.'
      });
    }
    
    const request = new sql.Request();

    // pass parameters to stored procedure
    request.input('Game_Id', sql.NVarChar, req.query.gameId || null);
    request.input('Game_Batch', sql.Int, parseInt(req.query.gameBatch) || null);
    request.input('Game_Team', sql.NVarChar, req.query.gameTeam || null);
    request.input('CMD_Line', sql.NVarChar, req.query.cmdLine || null);

    // Execute the stored procedure and return the result
    const result = await request.execute('UI_Charts_Info');
    res.json(result.recordset);

    } catch (err) {
        // Catch error at API call level and log to console
        console.error('Query failed:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;