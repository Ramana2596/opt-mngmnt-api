// File getBatchTeamInfo
// Purpose : Fetch Batch Team Info Data

const express = require('express');
const sql = require('mssql');
const router = express.Router();

router.get('/getBatchTeamInfo', async (req, res) => {
    try {
        const { gameId, gameBatch, cmdLine } = req.query;

        // 1. Check if all parameters exist
        if (!gameId || !gameBatch || !cmdLine) {
            return res.status(400).json({
                success: false,
                message: 'Missing parameter !.'
            });
        }

        // 2. Datatype check: ensure gameBatch is a valid integer
        const parsedGameBatch = parseInt(gameBatch, 10);
        if (isNaN(parsedGameBatch)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Batch must be a valid integer.' 
            });
        }

        const request = new sql.Request();

        // Pass parameters to the stored procedure
        request.input('Game_Id', sql.NVarChar, gameId);
        request.input('Game_Batch', sql.Int, parsedGameBatch);
        request.input('CMD_Line', sql.NVarChar, cmdLine);

        // Execute the stored procedure
        const result = await request.execute('UI_Batch_Team_Info');

        // Return recordset for front-end consumption
        return res.status(200).json(result.recordset);

    } catch (err) {
        // Catch error at API call level and log to console
        console.error('API Error [GET /getBatchTeamInfo]:', err);
        
        return res.status(500).json({ 
            success: false, 
            message: 'Internal Server Error', 
            error: err.message 
        });
    }
});

module.exports = router;