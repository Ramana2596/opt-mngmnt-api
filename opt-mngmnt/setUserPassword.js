// file: setUserPassword.js
// Set User Password

const express = require('express');
const sql = require('mssql');
const bcrypt = require('bcrypt');
const router = express.Router();

router.post('/setUserPassword', async (req, res) => {
    try {
        const {
            email,
            password,
            pfId,
            countryId,
            zoneId,
            mobileNo
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                returnValue: -1,
                message: 'Email and password are required'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const request = new sql.Request();

        request.input('User_Email', sql.NVarChar(100), email);
        request.input('Password', sql.NVarChar(255), hashedPassword);

        request.input('Learn_Mode', sql.NVarChar(20), null);
        request.input('PF_Id', sql.Int, pfId);
        request.input('Country_Id', sql.Int, countryId);
        request.input('Zone_Id', sql.Int, zoneId);
        request.input('Mobile_No', sql.NVarChar(20), mobileNo);

        request.input('CMD_Line', sql.NVarChar(100), 'Update_User');

        request.output('User_Id', sql.Int);
        request.output('Out_Message', sql.NVarChar(200));

        const result = await request.execute('UI_User_Profile_Trans');

        return res.json({
            returnValue: result.returnValue,
            userId: result.output.User_Id || null,
            message: result.output.Out_Message
        });

    } catch (err) {
        return res.status(500).json({
            returnValue: -1,
            message: `Server error: ${err.message}`
        });
    }
});

module.exports = router;