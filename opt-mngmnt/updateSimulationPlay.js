const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

sql.connect(dbConfig).then(() => {
    router.post('/updateSimulationPlay', async (req, res) => {
        if (req?.body?.cmdLine) {
              try {
                await sql.connect(dbConfig);
                const request = new sql.Request();
                
                // Add Parameters, validating data types, as in Stored Procedure
                request.input('Game_Id', sql.NVarChar, req?.body?.gameId || null);
                request.input('Game_Batch', sql.Int, parseInt(req?.body?.gameBatch) || null);
                request.input('Game_Team', sql.NVarChar, req?.body?.gameTeam || null);
                request.output('Out_Message', sql.NVarChar);  // No value, Just define type for output parameter.
                request.input('CMD_Line', sql.NVarChar, req?.body?.cmdLine || null);
            
                const result = await request.execute('UI_Game_Team_Play');
                console.log('Stored procedure result:', result);
            
                const message = result.output.Out_Message || "";
            
                // Otherwise success response with data & message
                res.json({
                  success: true,
                  message,
                });
            
              } catch (err) {
                console.error('SQL Error:', err);
                res.status(500).json({
                  success: false,
                  message: 'Internal server error',
                  error: err.message
                });
              }
        } else {
            res.status(400).send('cmdLine is required');
        }
    });
});

module.exports = router;
