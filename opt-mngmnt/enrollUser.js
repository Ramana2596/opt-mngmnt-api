const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

router.post('/enrollUser', async (req, res) => {
    try {
        // Guarantees your request uses the right pool/connection, Safer for multi-user apps 
        const pool = await sql.connect(dbConfig);
        
        // ✅ Extract POST body params
        const { gameId, userId, learnMode } = req.body;

        const request = new sql.Request(pool); // ✅ Use pool

        // ✅ Input parameters
        request.input('Game_Id', sql.NVarChar(20), gameId);
        request.input('User_Id', sql.Int, userId);
        request.input('Learn_Mode', sql.NVarChar(20), learnMode);
        request.output('Out_Message', sql.NVarChar(200));

        const result = await request.execute('UI_Enrol_User');

        return res.json({
            returnValue: result.returnValue, // 0 = success, 1 = business, -1 = error
            message: result.output.Out_Message || 'No message returned'
        });

    } catch (err) {
        console.error('SQL Error:', err);
        return res.json({
            returnValue: -1,
            message: `System error: ${err.message}`
        });
    }
});

module.exports = router;
