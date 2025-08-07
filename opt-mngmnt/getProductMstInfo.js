const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

sql.connect(dbConfig).then(() => {
    router.get('/getProductMstInfo', async (req, res) => {
        try {
            
            const request = new sql.Request();

            // Use correct data types based on SQL Server stored procedure
            request.input('Game_Id', sql.NVarChar, req.query.gameId);
            request.input('Game_Batch', sql.Int, parseInt(req.query.gameBatch));
            request.input('Game_Team', sql.NVarChar, req.query.gameTeam);

            const result = await request.execute('UI_Product_Mst_Info');

            res.json(result.recordset);
        } catch (err) {
            console.error('Query failed:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});


module.exports = router;
