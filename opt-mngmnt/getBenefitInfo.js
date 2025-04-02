const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

sql.connect(dbConfig).then(() => {
    router.get('/getBenefitInfo', async (req, res) => {
        try {
            const result = await sql.query(`
   EXEC [dbo].[UI_Benefit_Info]
        @Game_Id = '${req.query.gameId}'  `);
            res.json(result.recordset);
        } catch (err) {
            console.error('Query failed:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

module.exports = router;