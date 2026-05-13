// Filename: loginUser.js
// Authenticate user login using email and password

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

        // Validate user exists
        if (!result.recordset || result.recordset.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Extract user record
        const user = result.recordset[0];

        // Validate active user status
        if ((user.User_Status || '').toLowerCase() !== 'active') {
            return res.status(403).json({
                success: false,
                message: 'User account is not active'
            });
        }

        // Compare entered password with stored hash
        const isPasswordValid = await bcrypt.compare(
            password,
            user.Password
        );

        // Reject invalid password
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Return authenticated user details (safe response only)
        return res.json({
            success: true,
            user: {
                userId: user.User_Id,
                userName: user.User_Name,
                userEmail: user.User_Email,
                professionId: user.PF_Id,
                countryId: user.Country_Id,
                trustLevel: user.Trust_Level
            }
        });

    } catch (err) {
        console.error('Login failed:', err);

        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
});

module.exports = router;