// file: getBomInfo.js
// Purpose: Get BOM information from DB   
// Updated for correct data types format for parameters
// to eliminate error in data conversion

const express = require('express');
const sql = require('mssql');
const router = express.Router();

router.get('/getBomInfo', async (req, res) => {
    try {
        const { gameId, gameBatch, gameTeam } = req.query;

        // Check if parameters exist
        if (!gameId ) {
            return res.status(400).json({
                success: false,
                message: 'Missing parameter !.'
            });
        }

        const request = new sql.Request();

        // Pass Parameters to stored procedure
        request.input('Game_Id', sql.NVarChar, req.query.gameId || null);
        request.input('Game_Batch', sql.Int, parseInt(req.query.gameBatch) || null);
        request.input('Game_Team', sql.NVarChar, req.query.gameTeam || null);

        // Execute the stored procedure and return the result
        const result = await request.execute('UI_BOM_Info');
        res.json(result.recordset);

    } catch (err) {
        // Catch error at API call level and log to console
        console.error('Query failed:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
