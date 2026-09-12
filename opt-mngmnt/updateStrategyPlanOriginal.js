const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

sql.connect(dbConfig).then(() => {
    router.post('/updateStrategyPlan', async (req, res) => {
        const strategyPlans = req.body;

        try {
            const queries = strategyPlans.map(plan => {
                return sql.query(`
                    DECLARE @Game_Id NVARCHAR(20)
                    DECLARE @Game_Batch SMALLINT
                    DECLARE @Game_Team NVARCHAR(20)
                    DECLARE @Strategy_Set_No SMALLINT
                    DECLARE @Strategy_Id NVARCHAR(10)
                    DECLARE @Player_Decision NVARCHAR(5)
                    DECLARE @Decided_by NVARCHAR(50) = 'Faculty'
                    DECLARE @Decided_On DATE
                    DECLARE @CMD_Line NVARCHAR(100) = 'Update_Strategy_Plan'
                    SET @Game_Id = '${plan.gameId}'
                    SET @Game_Batch = ${plan.gameBatch}
                    SET @Game_Team = '${plan.gameTeam}'
                    SET @Strategy_Set_No = ${plan.strategySetNo}
                    SET @Strategy_Id = '${plan.strategyId}'
                    SET @Player_Decision = '${plan.playerDecision}'
                    SET @Decided_by = '${plan.decidedBy}'
                    SET @Decided_On = '${new Date().toISOString().split('T')[0]}'
                    SET @CMD_Line = @CMD_Line
                    EXEC [dbo].[UI_Strategy_Plan_Trans] 
                        @Game_Id = @Game_Id,
                        @Game_Batch = @Game_Batch,
                        @Game_Team = @Game_Team,
                        @Strategy_Set_No = @Strategy_Set_No,
                        @Strategy_Id = @Strategy_Id,
                        @Player_Decision = @Player_Decision,
                        @Decided_by = @Decided_by,
                        @Decided_On = @Decided_On,
                        @CMD_Line = @CMD_Line
                `);
            });

            const results = await Promise.all(queries);
            res.json(results.map(result => result.recordset));
        } catch (err) {
            console.error('Query failed:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

module.exports = router;
