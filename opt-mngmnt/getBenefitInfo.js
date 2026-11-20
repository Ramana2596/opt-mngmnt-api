// file: getBenefitInfo.js
//purpose: API to get benefit info

const express = require('express');
const sql = require('mssql');
const router = express.Router();

router.get('/getBenefitInfo', async (req, res) => {
    try {
        const { gameId } = req.query;
        if (!gameId) {
            return res.status(400).json({
                success: false,
                message: 'Missing parameter !.'
            });
        }

        const request = new sql.Request();

        // Parameters, validating Data types, to SP
        request.input('Game_Id', sql.NVarChar, gameId.trim());

        // Execute the stored procedure and return the result
        const result = await request.execute('UI_Benefit_Info');
        return res.json(result.recordset);

    } catch (err) {
        // Catch error at API call level and log to console
        console.error('Query failed:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: err.message
        });
    }
});

module.exports = router;
