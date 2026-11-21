// getProfessionInfo.js
// Purpose: Retrieve profession information of a team
// Uses API format template - dbconfig at App Level, check parameter & its data type, response  

const express = require('express');
const sql = require('mssql');
const router = express.Router();

router.get('/getProfessionInfo', async (req, res) => {
    try {
        const request = new sql.Request();

        // pass parameters to stored procedure
        request.input('Game_Id', sql.NVarChar, req.query.gameId || null);

        //
        const result = await request.execute('UI_Profession_Info');
        res.json(result.recordset);

    } catch (err) {
        // Catch error at API call level and log to console
        console.error('Query failed:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;