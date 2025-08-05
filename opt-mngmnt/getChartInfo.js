const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

sql.connect(dbConfig).then(() => {
    router.get('/getChartInfo', async (req, res) => {
        try {
            const framedQuery = `
                EXEC [dbo].[UI_Charts_Info] 
                        @Game_Id = '${req.query.gameId}',
                        @Game_Batch = ${req.query.gameBatch},
                        @Game_Team = '${req.query.gameTeam}',
                        @CMD_Line = '${req.query.cmdLine}'`;
            console.log('Executing query:', framedQuery);
            const result = await sql.query(framedQuery);
            res.json(result.recordset);
        } catch (err) {
            console.error('Query failed:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

module.exports = router;