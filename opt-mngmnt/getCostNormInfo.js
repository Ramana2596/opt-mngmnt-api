// getCostNormInfo.js
// Purpose: Fetches cost norm information.
// Uses API format template - dbconfig at App Level, check parameter & its data type, response
// Updated: Parameterised query, validating data types

const express = require('express');
const sql = require('mssql');
const router = express.Router();


router.get('/getCostNormInfo', async (req, res) => {
    try {
        const { gameId, gameBatch, gameTeam, cmdLine } = req.query;

        // Check if parameters exist
        if (!gameId) {
            return res.status(400).json({
                success: false,
                message: 'Missing parameter !.'
            });
        }

        const request = new sql.Request();

        // pass parameters to stored procedure
        request.input('Game_Id', sql.NVarChar, req.query.gameId || null);

        // Execute the stored procedure and return the result
        const result = await request.execute('UI_Cost_Norm_Info');
        res.json(result.recordset);

    } catch (err) {
        // Catch error at API call level and log to console
        console.error('Query failed:', err);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;