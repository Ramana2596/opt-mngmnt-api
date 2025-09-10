// Updated: Parameterised query, validating data types

const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

sql.connect(dbConfig).then(() => {
    router.get('/getUserProfile', async (req, res) => {
        try {
            const request = new sql.Request();

            // Add Parameters, validating Data types as in SP
            request.input('Game_Id', sql.NVarChar, req.query.gameId || null);
            request.input('CMD_Line', sql.NVarChar, req.query.cmdLine || null);
            const result = await request.execute('UI_User_Profile_Query');

            res.json(result.recordset);
        } catch (err) {
            console.error('Query failed:', err);
            res.status(500).send('Internal Server Error');
        }\
    });
});

module.exports = router;    

