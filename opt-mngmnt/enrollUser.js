const express = require('express');
const sql = require('mssql');
const router = express.Router();

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
