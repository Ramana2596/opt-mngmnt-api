// file getMarketFactorInfo.js
// Purpose: Fetch Market Information of a Batch
// Std API Format - dbConfig, Parament & datatype check, response

const express = require('express');
const sql = require('mssql');
const router = express.Router();

router.get('/getMarketFactorInfo', async (req, res) => {
    try {
        const { gameId, cmdLine } = req.query;

        // Validate mandatory parameters
        if (!gameId || !cmdLine) {
            return res.status(400).send('Missing Parameter');
        }

        // Check: Batch, needed for Market Info
        let batch = null;
        if (cmdLine !== 'Get_Batch') {
            if (!gameBatch) {
                return res.status(400).send('Missing Parameter');
            }
            batch = Number(gameBatch);
            if (!Number.isInteger(batch)) {
                return res.status(400).send('Batch must be integer');
            }
        }
        
        // Validate parameter type
        if (!Number.isInteger(Number(gameBatch))) {
            return res.status(400).send('Batch must be integer');
        }
        // Create request 
        const request = new sql.Request();

        // Map Parameters and datatypes SP Vs frontend
        request.input('Game_Id', sql.NVarChar(20), gameId);
        request.input('Game_Batch', sql.Int, Number(gameBatch));
        request.input('CMD_Line', sql.NVarChar(50), cmdLine);

        // Execute stored procedure
        const result = await request.execute('UI_Market_Factor_Info');
        res.json(result.recordset);

    } catch (err) {
        // Catch error at API call level and log to console            
        console.error('Query failed:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;