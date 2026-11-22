// getScreenInfo.js
// Purpose: Fetch screen information of a team
// Uses API format template - dbconfig at App Level, check parameter & its data type, response

const express = require('express');
const sql = require('mssql');
const router = express.Router();

router.get('/getScreenInfo', async (req, res) => {
    try {
        const { gameId } = req.query;

        // Validate mandatory parameters
        if (!gameId) {
            return res.status(400).json({
                success: false,
                code: -1,
                message: "Missing Parameter",
            });
        }

        const request = new sql.Request();

        // pass parameters to stored procedure
        request.input('Game_Id', sql.NVarChar, req.query.gameId || null);

        //  Execute the stored procedure to fetch screen information
        const result = await request.execute('UI_Screen_Mst_Info');
        res.json(result.recordset);

    } catch (err) {
        // Catch error at API call level and log to console
        console.error('Query failed:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;