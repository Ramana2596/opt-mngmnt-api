// file: setUserPassword.js
// Set hashed password for registered user

const express = require('express');
const sql = require('mssql');
const bcrypt = require('bcrypt');
const router = express.Router();

router.post('/setUserPassword', async (req, res) => {
    try {
        // Extract required inputs
        const { userId, password } = req.body;

        // Validate mandatory inputs
        if (!userId || !password) {
            return res.status(400).json({
                returnValue: -1,
                userId: null,
                message: 'UserId and password are required'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create SQL request
        const request = new sql.Request();

        // Required inputs for Set_Password only
        request.input('User_Id', sql.Int, userId);
        request.input('Password', sql.NVarChar(255), hashedPassword);
        request.input('CMD_Line', sql.NVarChar(100), 'Set_Password');

        // Output parameters
        request.output('User_Id', sql.Int);
        request.output('Out_Message', sql.NVarChar(200));

        const result = await request.execute('UI_User_Profile_Trans');

        return res.json({
            returnValue: result.returnValue,
            userId: result.output.User_Id || userId,
            message:
                result.output.Out_Message ||
                (result.returnValue === 0
                    ? 'Password set successfully'
                    : 'Check Input!')
        });

    } catch (err) {
        return res.status(500).json({
            returnValue: -1,
            userId: null,
            message: `Server error: ${err.message}`
        });
    }
});

module.exports = router;