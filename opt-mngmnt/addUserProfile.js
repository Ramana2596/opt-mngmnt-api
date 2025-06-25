const express = require('express');
const sql = require('mssql');
const router = express.Router();

router.post('/addUserProfile', async (req, res) => {
    try {
        await sql.connect(require('../dbConfig'));
        const { name, email, learnMode, pfId, cmdLine } = req.body;
        const request = new sql.Request();
        request.input('User_Name', sql.NVarChar(50), name);
        request.input('User_Email', sql.NVarChar(100), email);
        request.input('Learn_Mode', sql.NVarChar(20), learnMode);
        request.input('PF_Id', sql.Int, pfId);
        request.input('CMD_Line', sql.NVarChar(100), cmdLine);
        request.output('User_Id', sql.Int);
        const result = await request.execute('UI_User_Profile_Trans');

        if (result.returnValue === 0) {
            const getUserRequest = new sql.Request();
            getUserRequest.input('User_Name', sql.NVarChar(50), null);
            getUserRequest.input('User_Email', sql.NVarChar(100), email);
            getUserRequest.input('Learn_Mode', sql.NVarChar(20), null);
            getUserRequest.input('PF_Id', sql.Int, null);
            getUserRequest.input('CMD_Line', sql.NVarChar(100), 'Get_User');
            getUserRequest.output('User_Id', sql.Int);
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
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

module.exports = router;
