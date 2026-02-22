// getTeamProgressVirtual.js
// Express route for handling team progress in virtual simulation

const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');

const router = express.Router();

// Establish DB connection at app startup (not per request)
sql.connect(dbConfig).then(() => {

  // API endpoint for fetching/updating team progress
  router.post('/getTeamProgressVirtual', async (req, res) => {
    try {
      // Destructure camelCase keys from frontend payload
      const {
        gameId,
        gameBatch,
        gameTeam,
        completedPeriod,
        completedStageNo
      } = req.body; 

      // Validate required parameters
      if (!gameId || !gameBatch || !gameTeam || !completedPeriod || !completedStageNo) {
        return res.status(400).json({
          success: false,
          code: -1,
          message: "Missing parameters",
        });
      }

      const request = new sql.Request();

      // Bind stored procedure input parameters (PascalCase for DB)
      request.input('Game_Id', sql.NVarChar(20), gameId);              
      request.input('Game_Batch', sql.Int, Number(gameBatch));         
      request.input('Game_Team', sql.NVarChar(10), gameTeam);          
      request.input('Completed_Period', sql.NVarChar(10), completedPeriod);   
      request.input('Completed_Stage_No', sql.NVarChar(10), completedStageNo); 

      // Define output parameter for SP message
      request.output('Out_Message', sql.NVarChar(200));

      // Execute stored procedure
      const result = await request.execute('UI_Team_Progress_Virtual');

      // Extract return code, message, and data
      const code = result.returnValue ?? 0;
      const message = result.output?.Out_Message || '';
      const data = result.recordset?.[0] || null;

      // Send normal business response
      res.json({ success: code === 0, code, message, data });

    } catch (err) {
      // Handle DB/system errors during SP execution
      console.error('SQL Error:', err);
      res.status(500).json({ success: false, code: -1, message: err.message });
    }
  });

}).catch(err => {
  // Handle DB connection failure at application startup
  console.error('DB Connection Failed:', err);
});

module.exports = router;
