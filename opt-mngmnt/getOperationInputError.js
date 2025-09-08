// Updated for correct data types format for parameters
// to eliminate error in data conversion

const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();


sql.connect(dbConfig).then(() => {
    router.get('/getOperationInputError', async (req, res) => {
        try {
            const request = new sql.Request();  

            // Add Parameters, validating Data types as in SP
            request.input('Game_Id', sql.NVarChar, req.query.gameId  || null);
            request.input('Game_Batch', sql.Int, parseInt(req.query.gameBatch)  || null);
            request.input('Game_Team', sql.NVarChar, req.query.gameTeam || null);

            const result = await request.execute('UI_Operation_Input_Error');

            res.json(result.recordset);
        } catch (err) {
            console.error('Query failed:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

module.exports = router;


