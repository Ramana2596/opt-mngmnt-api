const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

sql.connect(dbConfig).then(() => {
    router.get('/getStrategySetData', async (req, res) => {        
        if (req.query.type === 'launchData') {
            try {
                const result = await sql.query(`DECLARE @Game_Id NVARCHAR(20)
    DECLARE @Game_Batch SMALLINT
    DECLARE @Strategy_Set_No SMALLINT
    DECLARE @CMD_Line NVARCHAR(100)
    SET @Game_Id = '${req.query.gameId}'
    SET @Game_Batch = ${req.query.gameBatch}
    SET @Strategy_Set_No = ${req.query.strategySetNo}
    SET @CMD_Line = 'Launch_Strategy_Set'
    EXEC [dbo].[UI_Strategy_Launched_Query]
        @Game_Id = @Game_Id,
        @Game_Batch = @Game_Batch,
        @Strategy_Set_No = @Strategy_Set_No,
        @CMD_Line = @CMD_Line`);
                res.json(result.recordset);
            } catch (err) {
                console.error('Query failed:', err);
                res.status(500).send('Internal Server Error');
            }
        } else if (req.query.type === 'getStrategySet') {
            try {
                const result = await sql.query(`DECLARE @Game_Id NVARCHAR(20)
    DECLARE @CMD_Line NVARCHAR(100)
    DECLARE @Game_Batch SMALLINT
    DECLARE @Strategy_Set_No SMALLINT
    SET @Game_Id = '${req.query.gameId}'
    SET @Game_Batch = NULL
    SET @Strategy_Set_No = NULL
    SET @CMD_Line = 'Get_Strategy'
    EXEC [dbo].[UI_Strategy_Launched_Query] 
        @Game_Id = @Game_Id,
        @Game_Batch = @Game_Batch,
        @Strategy_Set_No = @Strategy_Set_No,
        @CMD_Line = @CMD_Line`);
                res.json(result.recordset);
            } catch (err) {
                console.error('Query failed:', err);
                res.status(500).send('Internal Server Error');
            }
        } else if(req.query.type === 'getGameBatch') {
            try {
                const result = await sql.query(`
        DECLARE @Game_Id NVARCHAR(20)
    DECLARE @CMD_Line NVARCHAR(100)
    DECLARE @Game_Batch SMALLINT
    DECLARE @Strategy_Set_No SMALLINT
    SET @Game_Id = '${req.query.gameId}'
    SET @Game_Batch = NULL
    SET @Strategy_Set_No = NULL
    SET @CMD_Line = 'Get_Batch'
    EXEC [dbo].[UI_Strategy_Launched_Query] 
        @Game_Id = @Game_Id,
        @Game_Batch = @Game_Batch,
        @Strategy_Set_No = @Strategy_Set_No,
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