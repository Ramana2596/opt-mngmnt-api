const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

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


module.exports = router;