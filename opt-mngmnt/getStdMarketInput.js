const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');

const router = express.Router();

router.get('/getStdMarketInput', async (req, res) => {
  try {
    await sql.connect(dbConfig);
    const request = new sql.Request();

    request.input('Game_Id', sql.NVarChar, req.query.gameId);
    request.input('Game_Batch', sql.Int, parseInt(req.query.gameBatch));
    request.input('Game_Team', sql.NVarChar, req.query.gameTeam);
    request.output('OutMessage', sql.NVarChar(200));  // output parameter for message

    const result = await request.execute('UI_Std_Market_Input');

    const message = result.output.OutMessage || "";

    // If data is returned (rows), send with message
    const data = result.recordsets[0] || [];

    // If no data, maybe failure or no records condition
    if (data.length === 0 && message) {
      return res.json({
        success: false,
        message,
        data: []
      });
    }

    // Otherwise success response with data & message
    res.json({
      success: true,
      message,
      data
    });

  } catch (err) {
    console.error('SQL Error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
});

module.exports = router;
