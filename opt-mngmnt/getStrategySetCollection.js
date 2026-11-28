// getStrategySetCollection.js
// Purpose: Fetch Strategy Set Collection
// Std API Format - dbConfig, Parameter & datatype check, response

const express = require('express');
const sql = require('mssql');
const router = express.Router();

router.get('/getStrategySetCollection', async (req, res) => {
    try {
        const { gameId } = req.query;

        // Validate parameter
        if (!gameId) {
            return res.status(400).send('Missing Parameter');
        }
        // Map Parameters and datatypes SP Vs frontend
        const request = new sql.Request();

        request.input('Game_Id', sql.NVarChar(20), gameId);

        // Execute stored procedure and return rows
        const result = await request.execute('UI_Strategy_Set_Collection');
        res.json(result.recordset || []);

    } catch (err) {
        // Catch error at API call level and log to console
        console.error('Query failed:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
