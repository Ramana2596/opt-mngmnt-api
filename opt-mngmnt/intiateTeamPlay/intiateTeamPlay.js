const express = require('express');
const sql = require('mssql');
const dbConfig = require('../../dbConfig');
const moment = require('moment');
const router = express.Router();

sql.connect(dbConfig).then(() => {
    router.post('/intiateTeamPlay', async (req, res) => {
        try {
            const result = await sql.query(`
           EXEC [dbo].[Team_1_Initialisation]
               @Game_Id = ${req?.body?.gameId ? `${req.body.gameId}` : 'NULL'},
               @Game_Batch = ${req?.body?.gameBatch ? req.body.gameBatch : 'NULL'},
               @Game_Team = ${req?.body?.gameTeam ? req.body.gameTeam : 'NULL'}`);
            res.json(result.recordset);
        } catch (err) {
            console.error('Query failed:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

module.exports = router;
