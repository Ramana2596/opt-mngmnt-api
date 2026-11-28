
// File: getOperationInputError.js
// Purpose: Fetch Missing Operation Input
// Uses API format template - dbconfig at App Level, check parameter & its data type, response  

const express = require('express');
const sql = require('mssql');
const router = express.Router();

router.get('/getOperationInputError', async (req, res) => {
    try {
        const { gameId, gameBatch, gameTeam } = req.query || {};

        // Validate mandatory parameters (userEmail is optional here)
        if (!gameId || !gameBatch || !gameTeam) {
            return res.status(400).send('Missing Parameters');
        }

        if (!Number.isInteger(Number(gameBatch))) {
            return res.status(400).send('Batch must be integer');
        }

        const request = new sql.Request();

        // Pass parameters to stored procedure
        request.input('Game_Id', sql.NVarChar, gameId);
        request.input('Game_Batch', sql.Int, Number(gameBatch));
        request.input('Game_Team', sql.NVarChar, gameTeam);

        // Execute SP and get response
        const result = await request.execute('UI_Operation_Input_Error');
        res.json(result.recordset);

    } catch (err) {
        // Catch error at API call level and log to console
        console.error('Query failed:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;


