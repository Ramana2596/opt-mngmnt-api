const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();


sql.connect(dbConfig).then(() => {
    router.get('/getBatchQuery', async (req, res) => {
        try {
            
            const request = new sql.Request();

            // Use correct types based on SQL Server stored procedure
            request.input('Game_Id', sql.NVarChar, req.query.gameId  || null);
            request.input('Game_Batch', sql.Int, parseInt(req.query.gameBatch)  || null);
            request.input('CMD_Line', sql.NVarChar, req.query.cmdLine|| null);

            console.log(`UI_Batch_Query parameters:
                Game_Id: ${gameId},
                Game_Batch: ${gameBatch},
                CMD_Line: ${cmdLine}`);

            const result = await request.execute('UI_Batch_Query');

            console.log('Query result:', result.recordset); // Logs the returned rows
            
            res.json(result.recordset);
        } catch (err) {
            console.error('Query failed:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

module.exports = router;