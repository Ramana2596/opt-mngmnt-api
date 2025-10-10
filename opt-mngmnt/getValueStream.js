// getValueStream.js
// Purpose: Top-level API route to get value stream from SQL Server
// Updated: Parameterised query, validating data types
const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

/**
 * GET /api/getValueStream
 * Query param: gameId
 */
router.get('/getValueStream', async (req, res) => {
  try {
    // Get a connection from the pool
    const pool = await sql.connect(dbConfig);
    const request = pool.request();

    // Input parameter (validate type)
    request.input('Game_Id', sql.NVarChar, req.query.gameId || null);

    // Execute stored procedure
    const result = await request.execute('UI_Value_Stream');

    // Send result to frontend
    res.json(result.recordset || []);
  } catch (err) {
    console.error('Query failed:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;

/*
const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

sql.connect(dbConfig).then(() => {
    router.get('/getValueStream', async (req, res) => {
        try {
            const request = new sql.Request();

            // Add Parameters, validating Data types as in SP
            request.input('Game_Id', sql.NVarChar, req.query.gameId || null);

            const result = await request.execute('UI_Value_Stream');

            res.json(result.recordset);
        } catch (err) {
            console.error('Query failed:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});
*/