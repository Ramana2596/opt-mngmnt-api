// file: registerUser.js
// Create User Account WITH PASSWORD during final onboarding step

const express = require('express');
const sql = require('mssql');
const bcrypt = require('bcrypt');
const router = express.Router();

// Route handler: Register user profile
router.post('/registerUser', async (req, res) => {
    try {
        // Extract parameters from request body
        const {
            name,
            email,
            password,
            learnMode,
            pfId,
            countryId,
            cmdLine
        } = req.body;

        // Validate mandatory name
        if (!name || !name.trim()) {
            return res.status(400).json({
                returnValue: -1,
                userId: null,
                message: 'Name is required'
            });
        }

        // Validate mandatory email
        if (!email || !email.trim()) {
            return res.status(400).json({
                returnValue: -1,
                userId: null,
                message: 'Email is required'
            });
        }

        // Validate mandatory password
        if (!password || !password.trim()) {
            return res.status(400).json({
                returnValue: -1,
                userId: null,
                message: 'Password is required'
            });
        }

        //Hash password before DB insert
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create SQL request object
        const request = new sql.Request();

        // Pass input parameters to stored procedure
        request.input('User_Name', sql.NVarChar(50), name);
        request.input('User_Email', sql.NVarChar(100), email);
        request.input('Password', sql.NVarChar(255), hashedPassword); 
        //request.input('Learn_Mode', sql.NVarChar(20), learnMode || '');
        request.input('PF_Id', sql.Int, pfId);
        request.input('Country_Id', sql.Int, countryId);

        // Optional SP-compatible fields
        request.input('Zone_Id', sql.Int, null);
        request.input('Mobile_No', sql.NVarChar(20), null);
        request.input('Reset_Token', sql.NVarChar(255), null);
        request.input('Reset_Expiry', sql.DateTime, null);
        request.input('Modified_By', sql.Int, null);

        // Command mode defaults to Add_User
        request.input('CMD_Line', sql.NVarChar(100), cmdLine || 'Add_User');

        // Output parameters
        request.output('User_Id', sql.Int);
        request.output('SucValue', sql.Int);
        request.output('Out_Message', sql.NVarChar(200));

        const result = await request.execute('UI_User_Profile_Trans');

        // Send consistent response
        return res.json({
            returnValue: result.returnValue,
            userId: result.output.User_Id || null,
            sucValue: result.output.SucValue || null,
            message:
                result.output.Out_Message ||
                (result.returnValue === 0
                    ? 'User added successfully'
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