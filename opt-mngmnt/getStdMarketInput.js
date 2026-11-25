// getStdMarketInput.js
// Purpose: To fetch standard market input data for a batch
// Std API Format: GET, uses SP ; @SucValue and @Out_Message)


const express = require('express');
const sql = require('mssql');
const router = express.Router();

router.get('/getStdMarketInput', async (req, res) => {
  try {
    // Extract parameters from query string
    const { gameId, gameBatch, cmdLine } = req.query || {};

    // Validate mandatory parameters
    if (!gameId || !gameBatch || !cmdLine) {
      return res.status(400).send('Missing Parameter');
    }

    // Validate parameter type
    if (!Number.isInteger(Number(gameBatch))) {
      return res.status(400).send('Batch must be integer');
    }

    const request = new sql.Request();   // new per call

    // Map parameters and datatypes: SP vs frontend (length = SP length)
    request.input('Game_Id', sql.NVarChar(20), gameId);
    request.input('Game_Batch', sql.Int, Number(gameBatch));
    request.input('CMD_Line', sql.NVarChar(50), cmdLine);

    // Declare OUTPUT only if the SP has them
    request.output('SucValue', sql.Int);
    request.output('Out_Message', sql.NVarChar(200));

    // Execute stored procedure
    const result = await request.execute('UI_Std_Market_Input');

    // Status comes from the SP
    const sucValue = result.output.SucValue;
    const message = result.output.Out_Message ?? '';
    const data = result.recordset || [];

    // Validate SP execution status
    if (sucValue == null) throw new Error('SP did not return SucValue');

    return res.json({ success: sucValue === 0, sucValue, message, data });

  } catch (err) {
    // Catch error at API call level and log to console
    console.error('getStdMarketInput failed:', err);
    return res.status(500).send('Internal Server Error');
  }
});

module.exports = router;