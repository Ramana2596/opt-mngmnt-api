// file: publishMarketData.js
// Publish market data for a specific batch. SP is UI_Publish_Market_Data.

const express = require('express');
const sql = require('mssql');
const router = express.Router();

router.post('/publishMarketData', async (req, res) => {
  try {
    const request = new sql.Request();

    request.input('Game_Id',    sql.NVarChar, req.body.gameId);
    request.input('Game_Batch', sql.Int,      req.body.gameBatch);
    request.input('CMD_Line',   sql.NVarChar, req.body.cmdLine);

    request.output('SucValue',    sql.Int);
    request.output('Out_Message', sql.NVarChar);

    const result  = await request.execute('UI_Publish_Market_Data');

    const message = result.output.Out_Message || "";
    const data    = result.recordsets[0] || [];

    if (data.length === 0 && message) {
      return res.json({ success: false, message, data: [] });
    }

    res.json({ success: true, message, data });

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