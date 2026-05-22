// file: resetPassword.js
// Reset password using verification token criteria

const express = require('express');
const sql = require('mssql');
const bcrypt = require('bcrypt');
const router = express.Router();


router.post('/resetPassword', async (req, res) => {
    try {
        // Extract incoming structural parameters from request body
        const {
            gameId,
            email,
            token,
            newPassword
        } = req.body;

        // Basic request payload input validations
        if (!gameId || !email || !token || !newPassword) {
            return res.status(400).json({
                returnValue: -1,
                sucValue: null,
                message: 'Missing required parameters'
            });
        }
        // Convert to string and trim to prevent SQL issues
        const cleanGameId = String(gameId).trim();
        const cleanEmail = String(email).trim();
        const cleanToken = String(token).trim();

        // Hash the new password, using consistent hashing algorithm rule
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // SQL configuration 
        const request = new sql.Request();

        // Pass parameters mapping to SP
        request.input('Game_Id', sql.NVarChar(20), cleanGameId);
        request.input('User_Email', sql.NVarChar(100), cleanEmail);
        request.input('Reset_Token', sql.NVarChar(255), cleanToken);
        request.input('New_Password', sql.NVarChar(255), hashedNewPassword);

        // Bind Output flags
        request.output('SucValue', sql.Int);
        request.output('Out_Message', sql.NVarChar(200));

        // Execute SP
        const result = await request.execute('dbo.UI_Reset_Password');

        const dbSucValue = result.output.SucValue;
        const dbOutMessage = result.output.Out_Message;

        // Return SP resuls
        return res.json({
            returnValue: result.returnValue,
            sucValue: dbSucValue,
            message: dbOutMessage || (result.returnValue === 0 ? 'Operation completed' : 'Check Input!')
        });

    } catch (err) {
        return res.status(500).json({
            returnValue: -1,
            sucValue: null,
            message: `Server error: ${err.message}`
        });
    }
});

module.exports = router;