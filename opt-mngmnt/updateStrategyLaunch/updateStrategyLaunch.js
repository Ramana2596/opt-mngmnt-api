const express = require('express');
const sql = require('mssql');
const dbConfig = require('../../dbConfig');
const router = express.Router();

sql.connect(dbConfig).then(() => {
    router.post('/updateStrategyLaunch', async (req, res) => {
        if (req?.body?.cmdLine) {

            try {
                const framedQuery = `
                        EXEC [dbo].[UI_Market_Factor_Trans]
                        @Game_Id = ${req?.query?.gameId ? `${req.query.gameId}` : 'NULL'},
                        @Game_Batch = ${req?.query?.gameBatch ? req.query.gameBatch : 'NULL'},
                        @Strategy_Set_No = ${req?.query?.strategySetNo ? req.query.strategySetNo : 'NULL'},
                        @CMD_Line = ${req?.body?.cmdLine ? `'${req.body.cmdLine}'` : 'NULL'}`;
                const results = await Promise.all(framedQuery);
                res.json(results.map(result => result.recordset));
            } catch (err) {
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
