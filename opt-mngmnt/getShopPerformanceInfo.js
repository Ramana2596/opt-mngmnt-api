// getShopPerformanceInfo.js
// Purpose: retrieve shop performance information
// Uses API format template - dbconfig at App Level, check parameter & its data type, response

const express = require('express');
const sql = require('mssql');
const router = express.Router();


router.get('/getShopPerformanceInfo', async (req, res) => {
    try {
        // Extract parameters from payload
        const { gameId, gameBatch, gameTeam } = req.query || {};

        // Validate mandatory parameters
        if (!gameId || !gameBatch || !gameTeam) {
            return res.status(400).json({
                success: false,
                code: -1,
                message: "Missing Parameter",
            });
        }

        const request = new sql.Request();

        // parameter validation and type checking
        request.input('Game_Id', sql.NVarChar, req.query.gameId || null);
        request.input('Game_Batch', sql.Int, parseInt(req.query.gameBatch || null));
        request.input('Game_Team', sql.NVarChar, req.query.gameTeam || null);

        // Execute the stored procedure and return the result
        const result = await request.execute('UI_Shop_Performance_Info');
        res.json(result.recordset);

    } catch (err) {
        // Log the error and send a 500 response
        console.error('Query failed:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;