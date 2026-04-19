// SQL Query Construct Format request.execute ( ..... )
const express = require('express');
const sql = require('mssql');
//const dbConfig = require('../dbConfig');
const router = express.Router();


//sql.connect(dbConfig).then(() => {
    router.post('/getBatchMstQuery', async (req, res) => {
        try {
            
            const request = new sql.Request();

            // Use correct Data types based on SQL Server stored procedure
            request.input('Game_Id', sql.NVarChar, req.body.gameId  || null);
            request.input('Game_Batch', sql.Int, parseInt(req.body.gameBatch)  || null);
            request.input('CMD_Line', sql.NVarChar, req.body.cmdLine|| null);

            const result = await request.execute('UI_Batch_Mst_Query');

            res.json(result.recordset);
        } catch (err) {
            console.error('Query failed:', err);
            res.status(500).send('Internal Server Error');
        }
    });
//});


module.exports = router;
