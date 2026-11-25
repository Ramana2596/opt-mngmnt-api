// getValueStreamMap.js
// Purpose: Value Stream Map of Operations.
// API Format template - dbconfig at App Level, check parameter & its data type, response

const express = require('express');
const sql = require('mssql');
const router = express.Router();

router.get('/getValueStreamMap', async (req, res) => {
    try {
        const { gameId } = req.query;

        // Validate mandatory parameters (userEmail is optional here)
        if (!gameId) {
            return res.status(400).send('Missing Parameter');
        }

        const request = new sql.Request();

        // Map parameters and datatypes: SP vs frontend
        request.input('Game_Id', sql.NVarChar, gameId);

        // Execute Stored Procedure and get response
        const result = await request.execute('UI_Value_Stream_Map');
        res.json(result.recordset);

    } catch (err) {
        // Catch error at API call level and log to console
        console.error('Query failed:', err);
        return res.status(500).send('Internal Server Error');
    }
});

module.exports = router;