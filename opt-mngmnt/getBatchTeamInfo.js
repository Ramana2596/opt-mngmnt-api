// correct data types format for parametersto eliminate error in data conversion

const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

sql.connect(dbConfig).then(() => {
    router.get('/getBatchTeamInfo', async (req, res) => {
        try {
            
            const request = new sql.Request();

            // --- Define Input Parameters (match SP signature) ---
            request.input('Game_Id', sql.NVarChar, req?.body?.gameId || null);
            request.input('Game_Batch', sql.Int, parseInt(req?.body?.gameBatch) || null);
            request.input('CMD_Line', sql.NVarChar, req?.body?.cmdLine || null);
        
            // --- Define Output Parameter ---
            //request.output('Out_Message', sql.NVarChar(200));

            const result = await request.execute('UI_Batch_Team_Info');

            res.json(result.recordset);
        } catch (err) {
            console.error('Query failed:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

module.exports = router;
