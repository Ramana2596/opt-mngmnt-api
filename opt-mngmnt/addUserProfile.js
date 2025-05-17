const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

sql.connect(dbConfig).then(() => {
    router.post('/addUserProfile', async (req, res) => {
        const strategyPlans = req.body;

        try {
            const queries = strategyPlans.map(plan => {
                return sql.query(`
                    
                    EXEC [dbo].[UI_User_Profile_Trans] 
                        @User_Name = '${req.query.name}',
                       @User_Email  = '${req.query.email}',
                       @PF_Id   = '${req.query.pfId}',
                       @Learn_Mode = '${req.query.learnMode}',
                       @CMD_Line = '${req.query.cmdLine}'
                `);
            });

            const results = await Promise.all(queries);
            res.json(results.map(result => result.recordset));
        } catch (err) {
            console.error('Query failed:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

module.exports = router;
