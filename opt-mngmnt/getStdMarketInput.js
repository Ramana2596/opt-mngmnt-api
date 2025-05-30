const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const bindParams = require('../utils/bindParams');

const router = express.Router();

router.post('/getStdMarketInput', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const sqlRequest = pool.request(); // renamed to avoid confusion with `req`

    const params = {
      Game_Id: req.body.Game_Id,
      Game_Batch: req.body.Game_Batch,
      Game_Team: req.body.Game_Team
    };

    // Pass the correct sqlRequest, not Express req
    bindParams(sqlRequest, params);

    const result = await sqlRequest.execute('UI_Std_Market_Input');
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('SQL Error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
