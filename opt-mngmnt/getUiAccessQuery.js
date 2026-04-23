// getUiAccessQuery.js
// Standardized: returnValue (from @SucValue), Message, Data

const express = require('express');
const sql = require('mssql');
//const dbConfig = require('../dbConfig');

const router = express.Router();


router.post('/getUiAccessQuery', async (req, res) => {
    try {
        const { gameId, rlId, cmdLine } = req.body;

        if (!gameId || !rlId || !cmdLine) {
            return res.status(400).json({
                returnValue: 400,
                Message: "Missing Parameters",
                Data: []
            });
        }

        const request = new sql.Request();

        // SP Inputs 
        request.input('Game_Id', sql.NVarChar(20), gameId);
        request.input('RL_Id', sql.Int, rlId);
        request.input('CMD_Line', sql.NVarChar(50), cmdLine);

        // Define Output Parameters (ignored if not used in SP )
        request.output('Out_Message', sql.NVarChar(200));
        request.output('SucValue', sql.Int);

        // Execute SP
        const result = await request.execute('UI_Access_Query');

        // --- REPORT SP RESULTS
        // Prioritize @SucValue over standard returnValue
        const finalReturn = (result.output?.SucValue !==
            undefined && result.output?.SucValue !== null)
            ? result.output.SucValue
            : (result.returnValue ?? 0);

        res.json({
            returnValue: finalReturn,
            Message: result.output?.Out_Message || "",
            Data: result.recordset || []
        });

    } catch (err) {
        console.error('System Error:', err);

        res.status(500).json({
            returnValue: err.number || 500,
            Message: err.message || "Internal Server Error",
            Data: []
        });
    }
});

module.exports = router;