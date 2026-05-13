// Route: Register User Profile

// Import required modules
const express = require('express');
const sql = require('mssql');
const bcrypt = require('bcrypt'); // For password hashing
const router = express.Router();

// Route handler: Register user profile
router.post('/registerUser', async (req, res) => {
    try {
        // Extract user data / parameters from request body
        const {
            name,
            email,
            password,
            learnMode,
            pfId,
            countryId,
            cmdLine
        } = req.body;

        // Validate mandatory password input
        if (!password || !password.trim()) {
            return res.status(400).json({
                returnValue: -1,
                userId: null,
                message: 'Password is required'
            });
        }

        // Hash password before DB storage
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create SQL request using existing app-level DB connection
        const request = new sql.Request();

        // Pass input parameters to the stored procedure
        request.input('User_Name', sql.NVarChar(50), name);
        request.input('User_Email', sql.NVarChar(100), email);
        request.input('Password', sql.NVarChar(255), hashedPassword); 
        request.input('Learn_Mode', sql.NVarChar(20), learnMode);
        request.input('PF_Id', sql.Int, pfId);
        request.input('Country_Id', sql.Int, countryId);
        request.input('CMD_Line', sql.NVarChar(100), cmdLine);

        // Declare output parameters, matching the stored procedure
        request.output('User_Id', sql.Int);
        request.output('Out_Message', sql.NVarChar(200));

        const result = await request.execute('UI_User_Profile_Trans');

        // Send consistent JSON response back to frontend
        return res.json({
            returnValue: result.returnValue,
            userId: result.output.User_Id || null,
            message:
                result.output.Out_Message ||
                (result.returnValue === 0 ? '!' : 'Check Input!')
        });

    } catch (err) {
        // Handle SQL or server error
        return res.status(500).json({
            returnValue: -1,
            userId: null,
            message: `Server error: ${err.message}`
        });
    }
});

module.exports = router;