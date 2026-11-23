// getShopPerformanceInfo.js
// Purpose: retrieve shop performance information (FETCH only)
// Uses API format template - dbconfig at App Level, check parameters, data Types, response

const express = require('express');
const sql = require('mssql');
const router = express.Router();

router.get('/getShopPerformanceInfo', async (req, res) => {
    try {
        // Extract parameters from query string
        const { gameId, gameBatch, gameTeam } = req.query || {};

        // Validate mandatory parameters
        if (!gameId || !gameBatch || !gameTeam) {
            return res.status(400).send('Missing Parameter');
        }

        // Validate parameter type
        if (!Number.isInteger(Number(gameBatch))) {
            return res.status(400).send('Batch must be integer');
        }

        // Create request (new per call, never shared between users)
        const request = new sql.Request();

        // Map parameters and datatypes: SP vs frontend
        request.input('Game_Id', sql.NVarChar(20), gameId);
        request.input('Game_Batch', sql.Int, Number(gameBatch));
        request.input('Game_Team', sql.NVarChar(10), gameTeam);

        // Execute the stored procedure and return the rows
        const result = await request.execute('UI_Shop_Performance_Info');
        res.json(result.recordset || []);

    } catch (err) {
        // Catch error at API call level and log to console
        console.error('Query failed:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;