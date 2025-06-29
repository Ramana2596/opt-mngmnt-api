const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

router.get('/getUserProfile', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const { gameId, cmdLine } = req.query;
        const request = new sql.Request();
        request.input('Game_Id', sql.NVarChar(20), gameId !== undefined ? gameId : null);
        request.input('CMD_Line', sql.NVarChar(100), cmdLine);
        const result = await request.execute('UI_User_Profile_Query');
        res.json(result.recordset);
    } catch (err) {
        console.error('Query failed:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
