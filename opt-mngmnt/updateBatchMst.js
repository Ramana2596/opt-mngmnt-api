// updateBatchMst.js
// Purpose: Top-level API route to update batch master details via UI_Batch_Mst_Trans SP

const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

/**
 * POST /api/updateBatchMst
 * Body: JSON object containing batch details
 */
router.post('/', async (req, res) => {
  try {
    // Connect to SQL Server
    const pool = await sql.connect(dbConfig);
    const request = pool.request();

    const batchData = req.body;

    // Input parameters (match SP signature)
    request.input("Game_Id", sql.NVarChar(20), batchData.gameId);
    request.input("Game_Batch", sql.Int, batchData.gameBatch);
    request.input("Centre_Id", sql.Int, batchData.centreId);
    request.input("Faculty", sql.NVarChar(50), batchData.faculty);
    request.input("Facilitator", sql.NVarChar(50), batchData.facilitator);
    request.input("Venue", sql.NVarChar(100), batchData.venue);
    request.input("Start_Date", sql.Date, batchData.startDate);
    request.input("Duration", sql.SmallInt, batchData.duration);
    request.input("UOM", sql.NVarChar(10), batchData.uom);
    request.input("Close_Date", sql.Date, batchData.closeDate);
    request.input("Batch_Status", sql.NVarChar(20), batchData.batchStatus);
    request.input("CMD_Line", sql.NVarChar(20), batchData.CMD_Line || "Update");

    // Output parameter
    request.output("Out_Message", sql.NVarChar(200));

    // Execute stored procedure
    const result = await request.execute("UI_Batch_Mst_Trans");

    // Send response to frontend
    if (result.returnValue === 0) {
      res.json({
        success: true,
        message: result.output.Out_Message || "Batch updated successfully."
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.output.Out_Message || "Batch update failed."
      });
    }
  } catch (err) {
    console.error('updateBatchMst route error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
