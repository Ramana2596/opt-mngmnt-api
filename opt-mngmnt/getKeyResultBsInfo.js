// getKeyResultBsInfo.js
// Purpose:  Fetch Key Result Indicators from Balance Sheet data

const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');

const router = express.Router();

// DB connection ONCE at app startup
sql.connect(dbConfig).then(() => {

  router.post('/getKeyResultBsInfo', async (req, res) => {
    try {
      // Extract parameters from payload
      const { gameId, gameBatch, gameTeam } = req.body.params || {};

      // Validate mandatory parameters
      if (!gameId || !gameBatch || !gameTeam) {
        return res.status(400).json({
          success: false,
          code: -1,
          message: "Missing Parameter",
        })
      }

      // Use SQL pool request
      const pool = await sql.connect(dbConfig);                 
      const request = pool.request();                            

      // SP input parameters
      request.input('Game_Id', sql.NVarChar(20), gameId);
      request.input('Game_Batch', sql.Int, Number(gameBatch));
      request.input('Game_Team', sql.NVarChar(10), gameTeam);

      // Execute SP and inspect recordset metadata
      const result = await request.execute('UI_Key_Result_Bs_Info');

      // SQL execution informational code
      const code = result.returnValue ?? 0;
      const message = result?.output?.Out_Message ?? '';

      const data = result.recordset || [];     // As Array
      // Successful execution response
      res.json({ success: true, code, message, data });           

    } catch (err) {
      // DB / system error during SP execution
      console.error('SQL Error:', err);
      res.status(500).json({ success: false, code: -1, message: err.message });
    }

  });

}).catch(err => {
  // DB connection failure at application startup
  console.error('DB Connection Failed:', err);
});

module.exports = router;
