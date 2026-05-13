// Filename: getUserProfile.js
// Get user profile data, with Parameterised query, validating data types

const express = require('express');
const sql = require('mssql');
const router = express.Router();

// Route: Get user profile / LOV / login lookup data
router.get('/getUserProfile', async (req, res) => {
    try {
        // Create SQL request using app-level DB connection
        const request = new sql.Request();

        // Add parameters, validating data types as in SP
        request.input('Game_Id', sql.NVarChar, req.query.gameId || null);
        request.input('User_Email', sql.NVarChar, req.query.userEmail || null);
        request.input('Reset_Token', sql.NVarChar, req.query.resetToken || null);
        request.input('CMD_Line', sql.NVarChar, req.query.cmdLine || null);

        const result = await request.execute('UI_User_Profile_Query');

        res.json(result.recordset);
    } catch (err) {
        console.error('Query failed:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
