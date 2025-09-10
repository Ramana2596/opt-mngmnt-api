// Updated: Parameterised query, validating data types

const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

sql.connect(dbConfig).then(() => {
    router.get('/getRBACInfo', async (req, res) => {
        try {
            const request = new sql.Request();

            // Add Parameters, validating Data types as in SP
            request.input('Game_Id', sql.NVarChar, req.query.gameId || null);

            const result = await request.execute('UI_RBAC_Screen_Info');
            res.json(result.recordset);
        } catch (err) {
            console.error('Query failed:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

module.exports = router;