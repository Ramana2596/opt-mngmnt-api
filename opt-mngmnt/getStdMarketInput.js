/*
// New solution template using bindParams
const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const bindParams = require('../opt-mngmnt/utils/bindParams');

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

module.exports = router; */

// Using Existing solution template
const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();
/*
sql.connect(dbConfig).then(() => {
    router.get('/getStdMarketInput', async (req, res) => {
        try {
            const result = await sql.query(`
            EXEC [dbo].[UI_Std_Market_Input]
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
*/
sql.connect(dbConfig).then(() => {
    router.get('/getStdMarketInput', async (req, res) => {
        try {
            
            const request = new sql.Request();

            // Use correct data types based on SQL Server stored procedure
            request.input('Game_Id', sql.NVarChar, req.query.gameId);
            request.input('Game_Batch', sql.Int, parseInt(req.query.gameBatch));
            request.input('Game_Team', sql.NVarChar, req.query.gameTeam);

            const result = await request.execute('UI_Std_Market_Input');

            res.json(result.recordset);
        } catch (err) {
            console.error('Query failed:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

module.exports = router;