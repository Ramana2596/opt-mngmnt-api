// src/routes/getUserDetails.js
// Updated: Parameterised query, structured response using @SucValue

const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

sql.connect(dbConfig).then(() => {
  router.get('/getUserDetails', async (req, res) => {
    try {
      const request = new sql.Request();

      // Parameterised inputs (validated types as in SP)
      request.input('User_login', sql.NVarChar(50), req.query.userEmail || null);
      request.input('Game_Id', sql.NVarChar(20), req.query.gameId || 'OpsMgt');

      // Execute Stored Procedure
      const result = await request.execute('dbo.User_Login_Team_Info');

      // Use @SucValue returned by SP (via RETURN)
      const returnStatus = result.returnValue; // 0, 1, or -1

      res.json({
        returnStatus,                // direct from SP
        message:
          returnStatus === 0
            ? 'Login Successful !'
            : returnStatus === 1
              ? 'Login Detail is Wrong !'
              : 'System Error !',
        data: result.recordset       // rows returned by SP
      });
    } catch (err) {
      console.error('Unhandled error:', err);
      // Only for runtime/network errors
      res.status(500).json({
        returnStatus: -99,           // distinguish from SP’s -1
        message: 'Unhandled system/network error !',
        data: []
      });
    }
  });
});

module.exports = router;

/*
const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

sql.connect(dbConfig).then(() => {
    router.get('/getUserDetails', async (req, res) => {
            try {
                const result = await sql.query(`DECLARE
                           @User_login     nvarchar(50)    = '${req.query.userEmail}',
                           @Game_Id        nvarchar(20)    = 'OpsMgt'

                            EXECUTE [dbo].User_Login_Team_Info 
                               @User_login, @Game_Id`);
                res.json(result.recordset);
            } catch (err) {
                console.error('Query failed:', err);
                res.status(500).send('Internal Server Error');
            }
    });
});

module.exports = router;
*/
