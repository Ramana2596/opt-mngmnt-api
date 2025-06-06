/*
// New solution template

const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const bindParams = require('./utils/bindParams');

const router = express.Router();

router.post('/getStdOperationInput', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const request = pool.request();

    // Only pass parameters needed for this procedure
    const params = {
      Game_Id: req.body.Game_Id,
      Game_Batch: req.body.Game_Batch,
      Game_Team: req.body.Game_Team
    };

    // Use helper to bind with correct types
    bindParams(request, params);

    const result = await request.execute('UI_Std_Operation_Input');
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('SQL Error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
*/

// Using Existing solution template
const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

sql.connect(dbConfig).then(() => {
    router.get('/getStdOperationInput', async (req, res) => {
        try {
            const result = await sql.query(`
            EXEC [dbo].[UI_Std_Operation_Input]
                  @Game_Id = '${req.query.gameId}',
                  @Game_Batch = ${req.query.gameBatch},
                  @Game_Team = '${req.query.gameTeam}'`);
            res.json(result.recordset);
        } catch (err) {
            console.error('Query failed:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

module.exports = router;
