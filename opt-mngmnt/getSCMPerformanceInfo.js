// getSCMPerformanceInfo.js
// Purpose: Fetch SCM performance information of a team
// Uses API format template - dbconfig at App Level, check parameter & its data type, response  

const express = require('express');
const sql = require('mssql');
const router = express.Router();

router.get('/getSCMPerformanceInfo', async (req, res) => {
    try {
        const { gameId, gameBatch, gameTeam } = req.query;

        // Validate mandatory parameters
        if (!gameId || !gameBatch || !gameTeam) {
            return res.status(400).json({
                success: false,
                code: -1,
                message: "Missing Parameter",
            });
        }

        // Validate Game_Batch
        const batch = parseInt(gameBatch, 10);

        if (!Number.isInteger(batch)) {
            return res.status(400).json({
                success: false,
                code: -1,
                message: "Invalid!. Batch must be an integer",
            });
        }``

        const request = new sql.Request();

        // pass parameters to stored procedure
        request.input('Game_Id', sql.NVarChar, gameId);
        request.input('Game_Batch', sql.Int, batch);
        request.input('Game_Team', sql.NVarChar, gameTeam);

        //
        const result = await request.execute('UI_SCM_Performance_Info');
        res.json(result.recordset);

    } catch (err) {
        // Catch error at API call level and log to console
        console.error('Query failed:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;

