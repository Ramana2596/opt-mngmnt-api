const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

sql.connect(dbConfig).then(() => {
    router.get('/getStrategyPlan', async (req, res) => {
        if (req.query.type === 'getStrategyPlan') {
            try {
                const result = await sql.query(`DECLARE @Game_Id NVARCHAR(20)
    DECLARE @Game_Batch SMALLINT
    DECLARE @Game_Team NVARCHAR(20)
    DECLARE @CMD_Line NVARCHAR(100)
    SET @Game_Id = '${req.query.gameId}'
    SET @Game_Batch = ${req.query.gameBatch}
    SET @Game_Team = '${req.query.gameTeam}'
    SET @CMD_Line = 'Get_Strategy_Plan'
    EXEC [dbo].[UI_Strategy_Plan_Query] 
        @Game_Id = @Game_Id,
        @Game_Batch = @Game_Batch,
        @Game_Team = @Game_Team,
        @CMD_Line = @CMD_Line`);
                res.json(result.recordset);
            } catch (err) {
                console.error('Query failed:', err);
                res.status(500).send('Internal Server Error');
            }
        }
    });
});

module.exports = router;