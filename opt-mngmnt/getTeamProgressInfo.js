const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

/*
sql.connect(dbConfig).then(() => {
    router.get('/getTeamProgressInfo', async (req, res) => {
        try {
            const result = await sql.query(`
            EXEC [dbo].[UI_Team_Progress_Info]
                    @Game_Id = '${req.query.gameId}'`
                    );

            res.json(result.recordset);
        } catch (err) {
            console.error('Query failed:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

module.exports = router;
*/

router.get('/getTeamProgressInfo', async (req, res) => {
  try {
    await sql.connect(dbConfig);
    const request = new sql.Request();
    // Validate as a number
    const gameBatch = parseInt(req.query.gameBatch);

    request.input('Game_Id', sql.NVarChar, req.query.gameId);
    request.input('Game_Batch', sql.Int, gameBatch);
    request.input('CMD_Line', sql.NVarChar, req.query.cmdLine);

      const result = await request.execute('UI_Team_Progress_Info');

      res.json(result.recordset);
  } catch (err) {
            console.error('Query failed:', err);
            res.status(500).send('Internal Server Error');
        }
    });

/*
router.get('/getTeamProgressInfo', async (req, res) => {
  try {
    await sql.connect(dbConfig);
    const request = new sql.Request();
    // Validate as a number
    const gameBatch = parseInt(req.query.gameBatch);

    request.input('Game_Id', sql.NVarChar, req.query.gameId);
    request.input('Game_Batch', sql.Int, gameBatch);
    request.input('CMD_Line', sql.NVarChar, req.query.cmdLine);

      const result = await request.execute('UI_Team_Progress_Info');

      res.json(result.recordset);
    const data = result.recordset || [];

    let message;
    let success;

    if (data.length === 0) {
      message = 'No records for the Batch!';
      success = false;
    } else {
      message = 'Team progress information';
      success = true;
    }
    // Status code 200 for successful retrieval, even if no records found
    res.status(200).json({
      success,
      message,
      data
    });
  } 
    // Standard error handling
    catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
});
*/

module.exports = router;