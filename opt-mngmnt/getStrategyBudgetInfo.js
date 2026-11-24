// file getStrategyBudgetInfo.js
// Purpose: Fetch Budget for implementing Strategy of a team
// Std API Format - dbConfig, Parameter & dataType check, response

const express = require('express');
const sql = require('mssql');
const router = express.Router();

router.get('/getStrategyBudgetInfo', async (req, res) => {
    try {

        const { gameId, gameBatch, gameTeam } = req.query;

        // Validate mandatory parameters
        if (!gameId || !gameBatch || !gameTeam) {
            return res.status(400).send('Missing Parameter');
        }

        // Validate parameter type
        if (!Number.isInteger(Number(gameBatch))) {
            return res.status(400).send('Batch must be integer');
        }

        const request = new sql.Request();

        // Map parameters and datatypes: SP vs frontend
        request.input('Game_Id', sql.NVarChar(20), gameId);
        request.input('Game_Batch', sql.Int, gameBatch);
        request.input('Game_Team', sql.NVarChar(20), gameTeam);

        //  Execute stored procedure and return response
        const result = await request.execute('dbo.UI_Strategy_Budget_Info');
        res.json(result.recordset);

    } catch (err) {
        // Catch error at API call level and log to console
        console.error('Query failed:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
