// Filename: getUserProfile.js
// Authenticate user login and return streamlined session properties

const express = require('express');
const sql = require('mssql');
const bcrypt = require('bcrypt');
const router = express.Router();

// Route: Login user authentication
router.post('/loginUser', async (req, res) => {
    try {
        // Extract login credentials from request body
        const { email, password } = req.body;

        // Validate mandatory login inputs
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and Password are required'
            });
        }

        // Create SQL request using app-level DB connection
        const request = new sql.Request();

        // Pass parameters to stored procedure
        request.input('Game_Id', sql.NVarChar, 'OpsMgt');
        request.input('User_Email', sql.NVarChar, email);
        request.input('CMD_Line', sql.NVarChar, 'Login_User');

        const result = await request.execute('UI_User_Profile_Query');

        // Validate user exists and is active 
        if (!result.recordset || result.recordset.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Extract raw user record row
        const user = result.recordset[0];

        // Compare entered password with stored database hash
        const isPasswordValid = await bcrypt.compare(
            password,
            user.Password
        );

        // Reject invalid credential match
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

 
        // Delte password from recordset, Once bcrypt.compare matches
        delete user.Password;

        return res.json(result.recordset);

    } catch (err) {
        console.error('Login authentication process failed:', err);

        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
});

module.exports = router;