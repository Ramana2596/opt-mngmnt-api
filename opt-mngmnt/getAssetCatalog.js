// File AssetCatalog
// Purpose : Fetch Asset Catalog Data

const express = require('express');
const sql = require('mssql');
const router = express.Router();

router.get('/AssetCatalog', async (req, res) => {
    try {
        const { gameId, gameBatch, gameTeam } = req.query;

        // Check if all parameters exist
        if (!gameId || !gameBatch || !gameTeam) {
            return res.status(400).json({
                success: false,
                message: 'Missing parameter !.'
            });
        }

        // Datatype check: valid integer
        const parsedGameBatch = parseInt(gameBatch, 10);
        if (isNaN(parsedGameBatch)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Batch must be a valid integer.' 
            });
        }

        const request = new sql.Request();

        // Pass parameters to the stored procedure
        request.input('Game_Id', sql.NVarChar, gameId);
        request.input('Game_Batch', sql.Int, parsedGameBatch);
        request.input('Game_Team', sql.NVarChar, gameTeam);

        // Execute the stored procedure
        const result = await request.execute('UI_Asset_Catalog');

        // Return recordset for front-end consumption
        return res.status(200).json(result.recordset);

    } catch (err) {
        // Catch error at API call level and log to console
        console.error('API Error [GET /AssetCatalog]:', err);
        
        return res.status(500).json({ 
            success: false, 
            message: 'Internal Server Error', 
            error: err.message 
        });
    }
});

module.exports = router;