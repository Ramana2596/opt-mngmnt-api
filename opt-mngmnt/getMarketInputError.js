
// File: getMarketInputError.js
// Purpose: Fetch Missing Market Input
// Uses API format template - dbconfig at App Level, check parameter & its data type, response  

const express = require('express');
const sql = require('mssql');
const router = express.Router();

router.get('/getMarketInputError', async (req, res) => {
    try {
        const { gameId, gameBatch } = req.query || {};

        // Validate mandatory parameters (userEmail is optional here)
        if (!gameId || !gameBatch) {
            return res.status(400).send('Missing Parameters');
        }

        if (!Number.isInteger(Number(gameBatch))) {
            return res.status(400).send('Batch must be integer');
        }

        const request = new sql.Request();

        // Pass parameters to stored procedure
        request.input('Game_Id', sql.NVarChar(20), gameId);
        request.input('Game_Batch', sql.Int, Number(gameBatch));

        // Execute SP and get response
        const result = await request.execute('UI_Market_Input_Error');
        return res.status(200).json(result.recordset || []);

    } catch (err) {
        // Catch error at API call level and log to console
        console.error('Query failed:', err);
        return res.status(500).send('Internal Server Error');
    }
});

module.exports = router;