const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

sql.connect(dbConfig).then(() => {
    router.get('/getValidInputCodes', async (req, res) => {
        try {
            const result = await sql.query(`
   EXEC [dbo].[UI_Valid_Input_Codes]
        @Game_Id = '${req.query.gameId}' `);
            res.json(result.recordset);
        } catch (err) {
            console.error('Query failed:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

module.exports = router;
