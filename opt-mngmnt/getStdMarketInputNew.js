/*
// New solution template
const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const bindParams = require('../opt-mngmnt/utils/bindParams');

const router = express.Router();

router.post('/getStdMarketInputNew', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const sqlRequest = pool.request(); // renamed to avoid confusion with `req`

    const params = {
      Game_Id: req.body.Game_Id,
      Game_Batch: req.body.Game_Batch
    };

    // Pass the correct sqlRequest, not Express req
    bindParams(sqlRequest, params);

    const result = await sqlRequest.execute('UI_Std_Market_Input_New');
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('SQL Error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; */

// Using Existing solution template
const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

sql.connect(dbConfig).then(() => {
    router.get('/getStdMarketInputNew', async (req, res) => {
        try {
            const result = await sql.query(`
            EXEC [dbo].[UI_Std_Market_Input_New]
                  @Game_Id = '${req.query.gameId}',
                  @Game_Batch = ${req.query.gameBatch}`);
            res.json(result.recordset);
        } catch (err) {
            console.error('Query failed:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

module.exports = router;