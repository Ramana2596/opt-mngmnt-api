const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

sql.connect(dbConfig).then(() => {
    router.get('/getUserDetails', async (req, res) => {
            try {
                const result = await sql.query(`DECLARE
    @User_login     nvarchar(50)    = '${req.query.userEmail}',
    @Game_Id        nvarchar(20)    = 'OpsMgt',
    @Game_Batch     smallint        = NULL,                  
    @Game_Team      nvarchar(10)    = NULL,                  
    @Game_Leader    nvarchar(5)     = NULL,                  
    @Role           nvarchar(50)    = NULL                   

EXECUTE [dbo].User_Login_Team_Info 
    @User_login, @Game_Id, @Game_Batch, @Game_Team, @Game_Leader, @Role`);
                res.json(result.recordset);
            } catch (err) {
                console.error('Query failed:', err);
                res.status(500).send('Internal Server Error');
            }
    });
});

module.exports = router;