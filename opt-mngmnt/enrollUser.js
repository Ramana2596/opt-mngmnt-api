const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();
/*
router.post('/enrollUser', async (req, res) => {
    try {
        await sql.connect(require('../dbConfig'));
        const { gameId, userId, learnMode } = req.body;
        const request = new sql.Request();
        if (gameId !== undefined) {
            request.input('Game_Id', sql.NVarChar(20), gameId);
        }
        request.input('User_Id', sql.Int, userId);
        request.input('Learn_Mode', sql.NVarChar(20), learnMode);
        await request.execute('UI_Enrol_User');
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

module.exports = router;
*/


router.get('/enrollUser', async (req, res) => {
  try {
    await sql.connect(dbConfig);
    const request = new sql.Request();
    /*
    if (gameId !== undefined) {
            request.input('Game_Id', sql.NVarChar, gameId);
     }
    */
    request.input('Game_Id', sql.NVarChar, req.query.gameId);
    request.input('User_Id', sql.Int, parseInt(req.query.userId));
    request.input('Learn_Mode', sql.NVarChar, req.query.learnMode);
    request.output('OutMessage', sql.NVarChar);  // output parameter for message
 

    const result = await request.execute('UI_Enrol_User');

    const message = result.output.OutMessage || ' *No message returned*';
    
    res.json({
      success: true,
      message
    });
  } catch (err) {
    console.error('SQL Error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
});

module.exports = router;

