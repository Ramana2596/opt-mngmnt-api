// getStrategyLaunchGist.js
// Purpose: Fetch Gist of Strategy Sets launched
// Std API Format - dbConfig, Parament & datatype check, response

const express = require('express');
const sql = require('mssql');
const router = express.Router();

router.get('/getStrategyLaunchGist', async (req, res) => {
    try {
        const { gameId } = req.query;

        // Check if parameters exist
        if (!gameId) {
            return res.status(400).send('Missing Parameter');
        }
        // Create request 
        const request = new sql.Request();

        // Map Parameters and datatypes SP Vs frontend
        request.input('Game_Id', sql.NVarChar(20), gameId);

        // Execute stored procedure
        const result = await request.execute('UI_Strategy_Launch_Gist');
        res.json(result.recordset);

    } catch (err) {
        // Catch error at API call level and log to console
        console.error('Query failed:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;