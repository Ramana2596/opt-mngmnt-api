const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

sql.connect(dbConfig).then(() => {
    router.get('/getStrategyPlanTeam', async (req, res) => {
        try {
            const result = await sql.query(`
   EXEC [dbo].[UI_Strategy_Plan_Team] 
        @Game_Id = ${req?.query?.gameId ? `${req.query.gameId}` : 'NULL'},
        @Game_Batch = ${req?.query?.gameBatch ? req.query.gameBatch : 'NULL'},
        @Game_Team = ${req?.query?.gameTeam ? req.query.gameTeam : 'NULL'}
        `);
            res.json(result.recordset);
        } catch (err) {
            console.error('Query failed:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

module.exports = router;