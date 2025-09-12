const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

router.post('/addUserProfile', async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);

        const { name, email, learnMode, pfId, cmdLine } = req.body;
        const request = new sql.Request(pool);

        // Define input and output parameters
        request.input('User_Name', sql.NVarChar(50), name);
        request.input('User_Email', sql.NVarChar(100), email);
        request.input('Learn_Mode', sql.NVarChar(20), learnMode);
        request.input('PF_Id', sql.Int, pfId);
        request.input('CMD_Line', sql.NVarChar(100), cmdLine);
        request.output('User_Id', sql.Int);
        request.output('Out_Message', sql.NVarChar); // Matches working screen

        const result = await request.execute('UI_User_Profile_Trans');

        if (result.returnValue === 0) { 
            const getUserRequest = new sql.Request();

            getUserRequest.input('User_Name', sql.NVarChar(50), null);
            getUserRequest.input('User_Email', sql.NVarChar(100), email);
            getUserRequest.input('Learn_Mode', sql.NVarChar(20), null);
            getUserRequest.input('PF_Id', sql.Int, null);
            getUserRequest.input('CMD_Line', sql.NVarChar(100), 'Get_User');
            getUserRequest.output('User_Id', sql.Int);
            getUserRequest.output('Out_Message', sql.NVarChar);

            const getUserResult = await getUserRequest.execute('UI_User_Profile_Trans');

            return res.json({ 
                success: true, 
                userID: getUserResult.output.User_Id 
                }); 
            } else { 
                return res.status(400).json({
                    success: false, 
                    message: 'Failed to add user profile' 
                    });
            }
    
        // User Message from Stored Procedure
        if (result.returnValue === 0) {
            return res.json({
                success: true,
                userID: result.output.User_Id,
                message: result.output.Out_Message || 'User added successfully'
            });
        } else {
            return res.status(400).json({
                success: false,
                message: result.output.Out_Message || 'Failed to add user profile'
            });
        }

    // System Error
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error: ${err.message}`
            });
        } 
});

module.exports = router;