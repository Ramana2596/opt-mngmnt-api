const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

sql.connect(dbConfig).then(() => {
    router.post('/addUserProfile', async (req, res) => {

        try {
            const framedQuery = `
                    EXEC [dbo].[UI_User_Profile_Trans] 
                        @User_Name = '${req?.body?.name}',
                       @User_Email  = '${req?.body?.email}',
                       @PF_Id   = ${req?.body?.pfId},
                       @Learn_Mode = '${req?.body?.learnMode}',
                       @CMD_Line = '${req?.body?.cmdLine}'
                `;
            const results = await sql.query(framedQuery);
            res.json(results.recordset);
        } catch (err) {
            console.error('Query failed:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

module.exports = router;
