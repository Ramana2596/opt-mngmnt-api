// getStrategyMaster.js
// Purpose: Fetch Strategy Launched for a Batch
// Std API Format - dbConfig, Parament & datatype check, response

const express = require('express');
const sql = require('mssql');
const router = express.Router();

// Route: /getStrategyMaster
router.get('/getStrategyMaster', async (req, res) => {
    try {
        const { gameId, cmdLine } = req.query;

        // Validate mandatory parameters
        if (!gameId || !cmdLine) {
            return res.status(400).send('Missing Parameter');
        }

        // Create request
        const request = new sql.Request();

        // Map parameters and datatypes SP vs frontend
        request.input('Game_Id', sql.NVarChar(20), gameId);
        request.input('CMD_Line', sql.NVarChar(50), cmdLine);

        // Execute stored procedure
        const result = await request.execute('UI_Strategy_Mst_Query');
        return res.status(200).json(result.recordset);

    } catch (err) {
        // Catch error at API call level and log to console
        console.error('Query failed:', err);
        return res.status(500).send('Internal Server Error');
    }
});

module.exports = router;