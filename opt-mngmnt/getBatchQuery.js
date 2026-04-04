// SQL Query Construct Format request.execute ( ..... )
const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();


sql.connect(dbConfig).then(() => {
    router.post('/getBatchQuery', async (req, res) => {
        try {
            
            const request = new sql.Request();

            // Use correct Data types based on SQL Server stored procedure
            request.input('Game_Id', sql.NVarChar, req.body.gameId  || null);
            request.input('Game_Batch', sql.Int, parseInt(req.body.gameBatch)  || null);
            request.input('CMD_Line', sql.NVarChar, req.body.cmdLine|| null);

            const result = await request.execute('UI_Batch_Query');

            res.json(result.recordset);
        } catch (err) {
            console.error('Query failed:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});


module.exports = router;

// Manual SQL Query Construct format
/*
const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

sql.connect(dbConfig).then(() => {
    router.post('/getBatchQuery', async (req, res) => {
        try {
            const gameId = req.body.gameId || null;
            const gameBatch = req.body.gameBatch ? parseInt(req.body.gameBatch) : null;
            const cmdLine = req.body.cmdLine || null;

            // Construct SQL string safely (parameterized)
            const query = `
                EXEC UI_Batch_Query 
                    @Game_Id = ${gameId ? `'${gameId}'` : 'NULL'}, 
                    @Game_Batch = ${gameBatch !== null ? gameBatch : 'NULL'}, 
                    @CMD_Line = ${cmdLine ? `'${cmdLine}'` : 'NULL'}
            `;

            // Log query string
            console.log("Running query:\n", query);

            // Execute query
            const result = await sql.query(query);

            // Log response
            console.log("Query result:", result.recordset);

            res.json(result.recordset);
        } catch (err) {
            console.error("Query failed:", err);
            res.status(500).send("Internal Server Error");
        }
    });
});
*/
