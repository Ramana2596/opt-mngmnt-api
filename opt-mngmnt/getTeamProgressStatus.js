// getTeamProgressStatus.js/**
 * API Name   : getTeamProgressStatus.js
 * Purpose    : Executes [UI_Get_Team_Progress_Status] stored procedure
const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

sql.connect(dbConfig).then(() => {
    router.post('/getTeamProgressStatus', async (req, res) => {
      try {
        // Create SQL request
        const request = new sql.Request();
        
        // --- Define Input Parameters (match SP signature) ---
        request.input('Game_Id', sql.NVarChar, req?.body?.gameId || null);
        request.input('Game_Batch', sql.Int, parseInt(req?.body?.gameBatch) || null);
        request.input('Game_Team', sql.NVarChar, req?.body?.gameTeam || null);
        //request.input('CMD_Line', sql.NVarChar, req?.body?.cmdLine || null);
      
        // --- Define Output Parameter ---
        request.output('Out_Message', sql.NVarChar(200));

        // --- Execute Stored Procedure ---
        const result = await request.execute('UI_Team_Progress_Status');
        console.log('Stored procedure result:', result);
    
        // --- Extract values ---
        const message = result.output?.Out_Message || 'No message returned.';
        const returnValue = result.returnValue ?? -1; // SP return (0, 1, -1)

        // --- Standard JSON Response ---
        res.json({
          success: returnValue === 0, // true if SP success
          returnValue,
          message,
        });
    
      } catch (err) {
        console.error('SQL Error:', err);
        res.status(500).json({
          success: false,
          returnValue: -1,    // System/DB or network error
          message: 'Internal server error',
          error: err.message
        });
      }
    });
});

module.exports = router;
