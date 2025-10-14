// updateBatchMst.js
// Purpose: Top-level API route to update batch master details via UI_Batch_Mst_Trans SP

const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

// POST /api/updateBatchMst: Body: JSON object containing batch details
router.post('/updateBatchMst', async (req, res) => {

  try {
    // Connect to SQL Server
    const pool = await sql.connect(dbConfig);
    const request = pool.request();

    const batchData = req.body;

//  Input parameters (match SP signature and Form/payload keys)
    request.input("Game_Id", sql.NVarChar(20), batchData.Game_Id);
    request.input("Game_Batch", sql.Int, batchData.Game_Batch);
    request.input("Centre_Id", sql.Int, batchData.Centre_Id);
    request.input("Faculty", sql.Int, String(batchData.Faculty || ''));
    request.input("Facilitator", sql.Int, String(batchData.Facilitator || ''));
    request.input("Venue", sql.NVarChar(100), batchData.Venue);
    request.input("Start_Date", sql.Date, batchData.Start_Date);
    request.input("Duration", sql.TinyInt, batchData.Duration);
    request.input("UOM", sql.NVarChar(10), batchData.UOM || '');
    request.input("Close_Date", sql.Date, batchData.Close_Date);
    request.input("Batch_Status", sql.NVarChar(20), batchData.Batch_Status);
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
