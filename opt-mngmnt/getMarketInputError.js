const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

sql.connect(dbConfig).then(() => {
    router.get('/getMarketInputError', async (req, res) => {
        try {
            const result = await sql.query(`
   EXEC [dbo].[UI_Market_Input_Error]
        @Game_Id = '${req.query.gameId}',
        @Game_Batch = ${req.query.gameBatch}
        `);
            res.json(result.recordset);
        } catch (err) {
            console.error('Query failed:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

module.exports = router;