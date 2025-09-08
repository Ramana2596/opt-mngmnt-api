const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

/*
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
*/
sql.connect(dbConfig).then(() => {
    router.get('/getStrategyPlan', async (req, res) => {
        try {
            
            const request = new sql.Request();

            // Use correct types based on SQL Server stored procedure
            request.input('Game_Id', sql.NVarChar, req.query.gameId  || null);
            request.input('Game_Batch', sql.Int, parseInt(req.query.gameBatch)  || null);
            request.input('Game_Team', sql.NVarChar, req.query.gameTeam || null);
            request.input('CMD_Line', sql.NVarChar, req.query.cmdLine|| null);

            const result = await request.execute('UI_Strategy_Plan_Query');

            res.json(result.recordset);
        } catch (err) {
            console.error('Query failed:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

module.exports = router;