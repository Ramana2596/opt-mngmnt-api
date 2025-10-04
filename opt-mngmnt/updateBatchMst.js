// updateBatchMst.js
// Purpose: API call to update batch master details via [dbo].[UI_Batch_Mst_Trans] stored procedure
const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

/**
 * Updates batch master details using the UI_Batch_Mst_Trans stored procedure.
 * @param {Object} batchData - Contains all required fields for the SP.
 * @returns {Promise<{ success: boolean, message: string }>}
 */
async function updateBatchMst(batchData) {
  try {
    const pool = await sql.connect(dbConfig);
    const request = pool.request();

    // Input parameters
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

    // Output parameter
    request.output("Out_Message", sql.NVarChar(200));

    // Execute stored procedure
    const result = await request.execute("UI_Batch_Mst_Trans");

    return {
      success: result.returnValue === 0,
      message: result.output.Out_Message || "No message returned",
    };
  } catch (error) {
    return {
      success: false,
      message: `Error executing updateBatchMst: ${error.message}`,
    };
  }
}

module.exports = { updateBatchMst };
