// getUserDetails.js
// Purpose: Fetches user information.
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
