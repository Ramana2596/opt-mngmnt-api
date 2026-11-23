// getUserDetails.js
// Purpose: Fetches cost norm information.
// API Format template - dbconfig at App Level, check parameter & its data type, response

const express = require('express');
const sql = require('mssql');
const router = express.Router();

router.get('/getUserDetails', async (req, res) => {
  try {
    const { gameId, userEmail } = req.query;

    // Validate mandatory parameters (userEmail is optional here)
    if (!gameId) {
      return res.status(400).send('Missing Parameter');
    }

    const request = new sql.Request();

   // Map parameters and datatypes: SP vs frontend (length = SP length)
    request.input('Game_Id', sql.NVarChar(20), gameId);
    request.input('User_login', sql.NVarChar(50), userEmail || null);

    // Declare OUTPUT only if the SP has them
    request.output('SucValue', sql.Int);
    request.output('Out_Message', sql.NVarChar(200));

    // Execute Stored Procedure
    const result = await request.execute('User_Login_Team_Info');

    // Status comes from the SP
    const sucValue = result.output.SucValue ?? 0;
    const message = result.output.Out_Message ?? '';
    const data = result.recordset || [];

    return res.json({ success: sucValue === 0, sucValue, message, data });

  } catch (err) {
    // Catch error at API call level and log to console
    console.error('getUserDetails failed:', err);
    return res.status(500).send('Internal Server Error');
  }
});

module.exports = router;

/*
// getUserDetails.js
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
*/

