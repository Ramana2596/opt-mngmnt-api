const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const bindParams = require('./utils/bindParams');

const router = express.Router();

router.post('/getStdMarketInput', async (req, res) => {
  try {
    // Establish global connection
    await sql.connect(dbConfig);

    // Use a new request from the global connection pool
    const request = new sql.Request();

    // Prepare parameters
    const params = {
      Game_Id: req.body.Game_Id,
      Game_Batch: req.body.Game_Batch,
      Game_Team: req.body.Game_Team
    };

    // Bind parameters with proper types
    bindParams(request, params);

    // Execute the stored procedure
    const result = await request.execute('UI_Std_Market_Input');

    // Send response
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('SQL Error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
