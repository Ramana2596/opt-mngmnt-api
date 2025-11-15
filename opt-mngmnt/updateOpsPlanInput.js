const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const moment = require('moment');
const router = express.Router();

/*Converts a date string ("Jun-2025", "2025-06-01") to format 'YYYY-MM-DD' or null.*/
function getFormattedDate(dateStr) {
  if (!dateStr || dateStr === 'null') return null;
  const parsed = moment(dateStr, ['YYYY-MM-DD', 'MMM-YYYY']).startOf('month');
  return parsed.isValid() ? parsed.format('YYYY-MM-DD') : null;
}

/**
 * POST: /api/updatepsPlanInput
 * Handles Add / Update / Delete for operation plan data
 * Supports both single object and array payloads
 */
router.post('/updatepsPlanInput', async (req, res) => {
  try {
    console.log('🟢 Incoming Payload:', JSON.stringify(req.body, null, 2));

    const { cmdLine, opsPlanInfoArray } = req.body;

    if (!cmdLine) {
      return res.status(400).json({
        success: false,
        message: 'cmdLine: (Add / Update / Delete) is required '
      }); 
    }

    // Ensure input is always an array
    const opsArray =
      Array.isArray(opsPlanInfoArray) && opsPlanInfoArray.length > 0
        ? opsPlanInfoArray
        : [req.body];
  
    // Connect to SQL Server
    const pool = await sql.connect(dbConfig);
    const results = [];

    // Iterate through each record
    for (const OpsData of opsArray) {
      console.log('\n🚀 Executing SP: UI_Ops_Business_Plan_Trans');
      console.log('Parameters:');
      console.log({
        Game_Id: OpsData.gameId ?? null,
        Game_Batch: OpsData.gameBatch ?? null,
        Game_Team: OpsData.gameTeam ?? null,
        Production_Month: getFormattedDate(OpsData.productionMonth),
        Operations_Input_Id: OpsData.operationsInputId ?? null,
        Part_no: OpsData.partNo ?? null,
        Quantity_Id: OpsData.quantityId ?? null,
        Quantity: isFinite(Number(OpsData.quantity)) ? Number(OpsData.quantity) : null,
        Price_Id: OpsData.priceId ?? null,
        Currency: OpsData.currency ?? null,
        Unit_Price: isFinite(Number(OpsData.unitPrice)) ? Number(OpsData.unitPrice) : null,
        Created_on: new Date(),
        CMD_Line: cmdLine ?? OpsData.cmdLine ?? null
      });

      const request = pool.request();

      // Define all input parameters for SP
      request.input('Game_Id', sql.NVarChar, OpsData.gameId ?? null);
      request.input('Game_Batch', sql.Int, OpsData.gameBatch ?? null);
      request.input('Game_Team', sql.NVarChar, OpsData.gameTeam ?? null);
      request.input('Production_Month', sql.Date, getFormattedDate(OpsData.productionMonth));
      request.input('Operations_Input_Id', sql.NVarChar, OpsData.operationsInputId ?? null);
      request.input('Part_no', sql.NVarChar, OpsData.partNo ?? null);
      request.input('Quantity_Id', sql.NVarChar, OpsData.quantityId ?? null);
      request.input('Quantity', sql.Decimal(10, 2),
        Number.isFinite(+OpsData.quantity) ? +OpsData.quantity : null);
      request.input('Price_Id', sql.NVarChar, OpsData.priceId ?? null);
      request.input('Currency', sql.NVarChar, OpsData.currency ?? null);
      request.input('Unit_Price',sql.Decimal(10, 2),
        Number.isFinite(OpsData.unitPrice) ? +OpsData.unitPrice : null);
      request.input('Created_on', sql.Date, new Date());
      request.input('CMD_Line', sql.NVarChar, cmdLine ?? OpsData.cmdLine ?? null);

      // Output message from SP
      request.output('Out_Message', sql.NVarChar(200));

      // Execute stored procedure
      const result = await request.execute('UI_Ops_Business_Plan_Trans');

      const returnValue = result.returnValue;
      const success = returnValue === 0;
      const message = result.output?.Out_Message ?? 'No message returned';

      console.log('📄 SP Output:', message);

      // Add to result summary
      results.push({
        gameId: OpsData.gameId,
        partNo: OpsData.partNo,
        success,
        returnValue,
        message
      });
    }

    // Return summary response
    const overallSuccess = results.every(r => r.returnValue === 0);
    const overallMessage =
      overallSuccess
        ? 'All operations completed successfully'
        : results.find(r => r.returnValue !== 0)?.message || 'One or more operations failed';

    res.status(200).json({
      success: overallSuccess,
      returnValue: overallSuccess ? 0 : 1,
      message: overallMessage,
      results
    });

  } catch (err) {
    console.error('❌ Error executing updatepsPlanInput:', err);
    res.status(500).json({
      success: false,
      returnValue: -1,
      message: err.message || 'Unhandled exception'
    });
  }
});

module.exports = router;
