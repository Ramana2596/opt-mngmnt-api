const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();
/*
sql.connect(dbConfig).then(() => {
    router.get('/getAssetCatalogTeam', async (req, res) => {
        try {
            const result = await sql.query(`
                EXEC [dbo].[UI_Asset_Catalog_Team]
                        @Game_Id = '${req.query.gameId}',
                        @Game_Batch = ${req.query.gameBatch},
                        @Game_Team = '${req.query.gameTeam}'`);
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
    router.get('/getAssetCatalogTeam', async (req, res) => {
        try {
            
            const request = new sql.Request();

            // Use correct types based on SQL Server stored procedure
            request.input('Game_Id', sql.NVarChar, req.query.gameId);
            request.input('Game_Batch', sql.Int, parseInt(req.query.gameBatch));
            request.input('Game_Team', sql.NVarChar, req.query.gameTeam);

            const result = await request.execute('UI_Asset_Catalog_Team');

            res.json(result.recordset);
        } catch (err) {
            console.error('Query failed:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

module.exports = router;