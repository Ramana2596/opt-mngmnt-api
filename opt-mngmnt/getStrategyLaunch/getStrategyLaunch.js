// getStrategyLaunch.js
// Purpose: Fetch Strategy Launched for a Batch
// Std API Format - dbConfig, Parament & datatype check, response

const express = require('express');
const sql = require('mssql');
const router = express.Router();

// Route: 
router.get('/getStrategyLaunch', async (req, res) => {
    try {
        const { gameId, gameBatch, strategySetNo, cmdLine } = req.query;

        // Validate mandatory parameters
        if (!gameId || !gameBatch || !strategySetNo || !cmdLine) {
            return res.status(400).send('Missing Parameter');
        }

        // Validate parameter type
        if (!Number.isInteger(Number(gameBatch))) {
            return res.status(400).send('Batch must be integer');
        }

        // Create request 
        const request = new sql.Request();

        // Map Parameters and datatypes SP Vs frontend
        request.input('Game_Id', sql.NVarChar, gameId);
        request.input('Game_Batch', sql.Int, Number(gameBatch));
        request.input('Strategy_Set_No', sql.NVarChar, strategySetNo);
        request.input('CMD_Line', sql.NVarChar, cmdLine);

        // Execute stored procedure
        const result = await request.execute('UI_Strategy_Launched_Query');
        res.json(result.recordset);

    } catch (err) {
        // Catch error at API call level and log to console
        console.error('Query failed:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;



/*
const express = require('express');
const sql = require('mssql');
const dbConfig = require('../../dbConfig');
const router = express.Router();

sql.connect(dbConfig).then(() => {
    router.get('/getStrategyLaunch', async (req, res) => {
        try {
            const result = await sql.query(`
    EXEC [dbo].[UI_Strategy_Launched_Query]
        @Game_Id = ${req?.query?.gameId ? `${req.query.gameId}` : 'NULL'},
        @Game_Batch = ${req?.query?.gameBatch ? req.query.gameBatch : 'NULL'},
        @Strategy_Set_No = ${req?.query?.strategySetNo ? req.query.strategySetNo : 'NULL'},
        @CMD_Line = '${req.query.cmdLine}'`);
            res.json(result.recordset);
        } catch (err) {
            console.error('Query failed:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

module.exports = router;
*/
