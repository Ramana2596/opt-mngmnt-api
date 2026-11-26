// getValueStream.js
// Purpose: Fetch Value Stream Master Info
// API Format template - dbconfig at App Level, check parameter & its data type, response

const express = require('express');
const sql = require('mssql');
const router = express.Router();

router.get('/getValueStream', async (req, res) => {
  try {
    const { gameId } = req.query;

    // Validate mandatory parameters (userEmail is optional here)
    if (!gameId) {
      return res.status(400).send('Missing Parameter');
    }

    const request = new sql.Request();

    // Map parameters and datatypes: SP vs frontend
    request.input('Game_Id', sql.NVarChar, gameId);

    // Execute stored procedure and get response
    const result = await request.execute('UI_Value_Stream');
    res.json(result.recordset);

  } catch (err) {
    // Catch error at API call level and log to console
    console.error('Query failed:', err);
    res.status(500).send('Internal Server Error');
  }

});

module.exports = router;

