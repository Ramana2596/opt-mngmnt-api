const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

sql.connect(dbConfig).then(() => {
    router.get('/getStrategySetCollection', async (req, res) => {
        try {
            const result = await sql.query(`
            EXEC [dbo].[UI_Strategy_Set_Collection]
                @Game_Id = ${req?.query?.gameId ? `${req.query.gameId}` : 'NULL'}`);
            console.log(result);
            res.json(result.recordset);
        } catch (err) {
            console.error('Query failed:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

module.exports = router;
