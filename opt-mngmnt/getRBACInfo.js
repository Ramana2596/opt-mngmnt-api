// getRBACInfo.js
// Purpose: Retrieve RBAC information of a team
// Uses API format template - dbconfig at App Level, check parameter & its data type, response  

const express = require('express');
const sql = require('mssql');
const router = express.Router();

router.get('/getRBACInfo', async (req, res) => {
    try {

        const { gameId } = req.query;

        // Check if parameter exist
        if (!gameId) {
            return res.status(400).json({
                success: false,
                message: 'Missing parameter !.'
            });
        }

        const request = new sql.Request();

        // pass parameters to stored procedure
        request.input('Game_Id', sql.NVarChar, req.query.gameId || null);

        //  Execute the stored procedure and return the result
        const result = await request.execute('UI_RBAC_Screen_Info');
        res.json(result.recordset);

    } catch (err) {
        // Catch error at API call level and log to console
        console.error('Query failed:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;