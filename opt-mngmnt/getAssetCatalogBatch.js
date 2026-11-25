// File getAssetCatalogBatch
// Purpose : Fetch Asset Catalog Batch Data

const express = require('express');
const sql = require('mssql');
const router = express.Router();

router.get('/getAssetCatalogBatch', async (req, res) => {
    try {
        const { gameId, gameBatch, cmdLine } = req.query;

        // Check if parameters exist
        if (!gameId || !gameBatch || !cmdLine) {
            return res.status(400).send('Missing Parameter');
        }

        // Validate parameter type
        if (!Number.isInteger(Number(gameBatch))) {
            return res.status(400).send('Batch must be integer');
        }

        // Pass parameters to the stored procedure
        const request = new sql.Request();

        // Map parameters and datatypes: SP vs frontend (length = SP length)
        request.input('Game_Id', sql.NVarChar(20), gameId);
        request.input('Game_Batch', sql.Int, Number(gameBatch));
        request.input('CMD_Line', sql.NVarChar(50), cmdLine);

        // Execute the stored procedure and return the result
        const result = await request.execute('UI_Asset_Catalog_Info');
        return res.status(200).json(result.recordset);

    } catch (err) {
        // Catch error at API call level and log to console
        console.error('API Error [GET /getAssetCatalogBatch]:', err);
        return res.status(500).send('Internal Server Error');
    });
    }
});

module.exports = router;