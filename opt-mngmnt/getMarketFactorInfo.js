const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

sql.connect(dbConfig).then(() => {
    router.get('/getMarketFactorInfo', async (req, res) => {
            try {
                const result = await sql.query(`DECLARE @Game_Id NVARCHAR(20)
    DECLARE @Game_Batch SMALLINT
    SET @Game_Id = '${req.query.gameId}'
    SET @Game_Batch = ${req.query.gameBatch}
   EXEC [dbo].[UI_Market_Factor_Info] 
        @Game_Id = @Game_Id,
        @Game_Batch = @Game_Batch,
        @CMD_Line = 'Market_Factor'`);
                res.json(result.recordset);
            } catch (err) {
                console.error('Query failed:', err);
                res.status(500).send('Internal Server Error');
            }
    });
});

module.exports = router;