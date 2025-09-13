// Import required modules
const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

// Route: Add User Profile: This endpoint inserts a new user profile into the system
router.post('/addUserProfile', async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
 
        // Extract user data /parameters from request body
        const { name, email, learnMode, pfId, cmdLine } = req.body;

        const request = new sql.Request(pool);

        // Pass input parameters to the stored procedure
        request.input('User_Name', sql.NVarChar(50), name);
        request.input('User_Email', sql.NVarChar(100), email);
        request.input('Learn_Mode', sql.NVarChar(20), learnMode);
        request.input('PF_Id', sql.Int, pfId);
        request.input('CMD_Line', sql.NVarChar(100), cmdLine);

        // Declare output parameters, matching the stored procedure       
        request.output('User_Id', sql.Int);
        request.output('Out_Message', sql.NVarChar(200)); // Matches working screen

        const result = await request.execute('UI_User_Profile_Trans');

        // Send consistent JSON response back to frontend
        return res.json({
            returnValue: result.returnValue,               // 0, 1, or -1
            userID: result.output.User_Id || null,
            message: result.output.Out_Message || 
                     (result.returnValue === 0
                        ? ' !'
                        : 'Check Input!')
        });

    } catch (err) {
        // Handle SQL or server error
        return res.status(500).json({
            returnValue: -1,
            userID: null,
            message: `Server error: ${err.message}`
        });
    }
});


module.exports = router;