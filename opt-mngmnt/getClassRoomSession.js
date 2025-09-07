
// Updated for correct data types format
const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

sql.connect(dbConfig).then(() => {
  router.get('/getClassRoomSession', async (req, res) => {
    try {
      const request = new sql.Request();

      // Add parameters
      request.input('Game_Id', sql.NVarChar(20), req.query.gameId || null);
      request.input('Game_Batch', sql.Int, parseInt(req.query.gameBatch) || null);

      const result = await request.execute('dbo.UI_Class_Room_Session');
      res.json(result.recordset);
    } catch (err) {
      console.error('Query failed:', err);
      res.status(500).send('Internal Server Error');
    }
  });
});

module.exports = router;
