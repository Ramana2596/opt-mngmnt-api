const express = require('express');
const sql = require('mssql');
const dbConfig = require('../../dbConfig');
const router = express.Router();

sql.connect(dbConfig).then(() => {
    router.post('/updateGameTeamPlay', async (req, res) => {
        if (req?.body?.cmdLine) {
            try {
                const framedQuery = `    
                        EXEC [dbo].[UI_Game_Team_Play]
                            @Game_Id = ${req?.body?.gameId ? `'${req.body.gameId}'` : 'NULL'},
                            @Game_Batch = ${req?.body?.gameBatch ? `'${req.body.gameBatch}'` : 'NULL'},
                            @Game_Team = ${req?.body?.gameTeam ? `'${req.body.gameTeam}'` : 'NULL'},
                            @CMD_Line = ${req?.body?.cmdline ? `'${req.body.cmdline}'` : 'NULL'}
                        `;

                const results = await sql.query(framedQuery);
                res.json(results.recordset);
            } catch (err) {
                console.error('Query failed:', err);

                if (err.originalError && err.originalError.info && err.originalError.info.message) {
                    const errorMessage = err.originalError.info.message;
                    res.status(400).send({ error: errorMessage });
                } else {
                    res.status(500).send('Internal Server Error');
                }
            }
        } else {
            res.status(400).send('cmdLine is required');
        }
    });
});

module.exports = router;
