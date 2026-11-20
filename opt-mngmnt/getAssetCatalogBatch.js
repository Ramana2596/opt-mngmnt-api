// File getAssetCatalogBatch
// Purpose : Fetch Asset Catalog Batch Data

const express = require('express');
const sql = require('mssql');
const router = express.Router();

router.get('/getAssetCatalogBatch', async (req, res) => {
    try {
        const { gameId, gameBatch, cmdLine } = req.query;

        // Check if parameters exist
        if (!gameId || !cmdLine) {
            return res.status(400).json({
                success: false,
                message: 'Missing parameter !.'
            });
        }

        // Asset_Catalog needs a batch; Get_Batch (dropdown list) does not
        if (cmdLine === 'Asset_Catalog' && !gameBatch) {
            return res.status(400).json(
                { success: false, message: 'Batch is required for Asset_Catalog.' });
        }

        // Validate Batch as an integer 
        let parsedGameBatch = null;
        if (gameBatch) {
            parsedGameBatch = Number(gameBatch);
            if (!Number.isInteger(parsedGameBatch)) {
                return res.status(400).json({
                    success: false, 
                    message: 'Batch must be a valid integer.'
                });
            }
        }

        // Pass parameters to the stored procedure
        const request = new sql.Request();

        request.input('Game_Id', sql.NVarChar, gameId);
        request.input('Game_Batch', sql.Int, parsedGameBatch);
        request.input('CMD_Line', sql.NVarChar, cmdLine);

        // Execute the stored procedure and return the result
        const result = await request.execute('UI_Asset_Catalog_Batch');
        return res.status(200).json(result.recordset);

    } catch (err) {
        // Catch error at API call level and log to console
        console.error('API Error [GET /getAssetCatalogBatch]:', err);
        
        return res.status(500).json({ 
            success: false, 
            message: 'Internal Server Error', 
            error: err.message 
        });
    }
});

module.exports = router;