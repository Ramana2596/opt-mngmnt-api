// File: loginOAuthUser.js
// Authenticate OAuth user by email and return streamlined session properties

const express = require('express');
const sql = require('mssql');
const router = express.Router();

// Route: OAuth user authentication
router.post('/loginOAuthUser', async (req, res) => {
    try {
        // Extract OAuth login information
        const { email,cmdLine } = req.body;

        // Validate mandatory input
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Create SQL request using app-level DB connection
        const request = new sql.Request();

        // Pass parameters to stored procedure
        request.input('Game_Id', sql.NVarChar, 'OpsMgt');
        request.input('User_Email', sql.NVarChar, email);
        request.input('CMD_Line', sql.NVarChar, cmdLine);

        const result = await request.execute('UI_User_Profile_Query');

        // User not found
        if (!result.recordset || result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Return user profile
        return res.json(result.recordset);

    } catch (err) {
        console.error('OAuth authentication process failed:', err);

        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
});

module.exports = router;