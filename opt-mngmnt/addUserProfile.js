const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

router.post('/addUserProfile', async (req, res) => {
    console.log('Incoming request body:', req.body);

    try {
        ✅ console.log('Connecting to SQL Server...'); // Log connection attempt
        const pool = await sql.connect(dbConfig);
        ✅ console.log('Connected to SQL Server'); // Confirm connection success

        const { name, email, learnMode, pfId, cmdLine } = req.body;

        ✅ // Validate required fields
        ✅ if (!name || !email || !learnMode || !pfId || !cmdLine) {
        ✅     console.error('Missing required fields in request body');
        ✅     return res.status(400).json({
        ✅         success: false,
        ✅         message: 'Missing required fields: name, email, learnMode, pfId, cmdLine'
        ✅     });
        ✅ }

        ✅ // Log raw input values
        ✅ console.log('Input values:', { name, email, learnMode, pfId, cmdLine });

        const request = new sql.Request(pool);

        // Define input and output parameters
        request.input('User_Name', sql.NVarChar(50), name);
        request.input('User_Email', sql.NVarChar(100), email);
        request.input('Learn_Mode', sql.NVarChar(20), learnMode);
        request.input('PF_Id', sql.Int, pfId);
        request.input('CMD_Line', sql.NVarChar(100), cmdLine);
        request.output('User_Id', sql.Int);
        request.output('Out_Message', sql.NVarChar); // Matches working screen

        ✅ // Log parameters to ensure they are set
        ✅ console.log('SQL Parameters:', JSON.stringify(request.parameters, null, 2));

        console.log('Executing stored procedure: UI_User_Profile_Trans');
        const result = await request.execute('UI_User_Profile_Trans');

        ✅ // Log full result for debugging
        ✅ console.log('Stored procedure result:', JSON.stringify(result, null, 2));

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
    } catch (err) {
        console.error('SQL Error:', err);
        return res.status(500).json({
            success: false,
            message: `Server error: ${err.message}`
        });
    } finally {
        ✅ sql.close(); // Close connection pool
    }
});

module.exports = router;