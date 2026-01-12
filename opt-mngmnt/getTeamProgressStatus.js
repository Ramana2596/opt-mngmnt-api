// getTeamProgressStatus.js

const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');

const router = express.Router();

// DB connection at app startup (not per request)
sql.connect(dbConfig).then(() => {

  router.post('/getTeamProgressStatus', async (req, res) => {
    try {
      const request = new sql.Request();

      // SP input parameters
      request.input('Game_id', sql.NVarChar(20), req?.body?.gameId || null);
      request.input('Game_Batch', sql.Int, Number(req?.body?.gameBatch) || null);
      request.input('Game_Team', sql.NVarChar(10), req?.body?.gameTeam || null);

      // SP output parameter
      request.output('Out_Message', sql.NVarChar(200));

      // Execute SP
      const result = await request.execute('UI_Team_Progress_Status');

      // Business return code (0 = normal, 1 = business-rule issue)
      const code = result.returnValue ?? 0;

      // Message fully controlled by SP
      const message = result.output?.Out_Message || '';

      // Single-row status payload
      const data = result.recordset?.[0] || null;

      // Normal business response
      res.json({ success: code === 0, code, message, data });

    } catch (err) {
      // DB / system error during SP execution (THROW 50001)
      console.error('SQL Error:', err);
      res.status(500).json({ success: false, code: -1, message: err.message });
    }
  });

}).catch(err => {
  // DB connection failure at application startup
  console.error('DB Connection Failed:', err);
});

module.exports = router;
