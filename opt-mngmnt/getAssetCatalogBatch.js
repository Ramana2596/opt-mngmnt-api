// Updated for correct data types format for parameters
// to eliminate error in data conversion
const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();
/*
sql.connect(dbConfig).then(() => {
    router.get('/getAssetCatalogBatch', async (req, res) => {
        try {
            const result = await sql.query(`
                    EXEC [dbo].[UI_Asset_Catalog_Batch]
                        @Game_Id = ${req?.query?.gameId ? `${req.query.gameId}` : 'NULL'},
                        @Game_Batch = ${req?.query?.gameBatch ? req.query.gameBatch : 'NULL'},
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

sql.connect(dbConfig).then(() => {
    router.get('/getAssetCatalogBatch', async (req, res) => {
        try {
    
            const request = new sql.Request();

            // Use correct types based on SQL Server stored procedure
            request.input('Game_Id', sql.NVarChar, req.query.gameId || null);
            request.input('Game_Batch', sql.Int, parseInt(req.query.gameBatch) || null);
            request.input('CMD_Line', sql.NVarChar, req.query.cmdLine|| null);

            const result = await request.execute('UI_Asset_Catalog_Batch');

            res.json(result.recordset);
        } catch (err) {
            console.error('Query failed:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

module.exports = router;