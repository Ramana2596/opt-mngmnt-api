
/*
const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const moment = require('moment');
const router = express.Router();

function getFormattedDate(marketFactorInfoObj) {
//    const date = marketFactorInfoObj?.productionMonth !== 'null' 
// ? `'${moment(marketFactorInfoObj?.productionMonth, 'YYYY-MM-DD').format('YYYY-MM-DD')}'` : null;
    const date = marketFactorInfoObj?.productionMonth !== 'null'
    ? `'${moment(marketFactorInfoObj?.productionMonth, ['YYYY-MM-DD', 'MMM-YYYY']).startOf('month').format('YYYY-MM-DD')}'`
    : 'NULL';
return date;
}

sql.connect(dbConfig).then(() => {
    router.post('/updateOperationalDecisionInput', async (req, res) => {
        if (req?.body?.cmdLine) {
            const operationalDecisionInfo = req?.body?.operationalPlanInfoArray;

            try {
                const queries = operationalDecisionInfo.map(operationalDecisionInfoObj => {
                    const framedQuery = `
EXEC [dbo].[UI_Ops_Business_Plan_Trans]
    @Game_Id = ${operationalDecisionInfoObj?.gameId ? `'${operationalDecisionInfoObj.gameId}'` : 'NULL'},
    @Game_Batch = ${operationalDecisionInfoObj?.gameBatch ?? 'NULL'},
    @Game_Team = ${operationalDecisionInfoObj?.gameTeam ?? 'NULL'},
    @Production_Month = ${getFormattedDate(operationalDecisionInfoObj)},
    @Operations_Input_Id = ${operationalDecisionInfoObj?.operationsInputId ? `'${operationalDecisionInfoObj.operationsInputId}'` : 'NULL'},
    @Part_no = ${operationalDecisionInfoObj?.partNo ? `'${operationalDecisionInfoObj.partNo}'` : 'NULL'},
    @Quantity_Id = ${operationalDecisionInfoObj?.quantityId ? `'${operationalDecisionInfoObj.quantityId}'` : 'NULL'},
    @Quantity = ${Number(operationalDecisionInfoObj?.quantity) ?? 'NULL'},
    @Price_Id = ${operationalDecisionInfoObj?.priceId ? `'${operationalDecisionInfoObj.priceId}'` : 'NULL'},
    @Currency = ${operationalDecisionInfoObj?.currency ? `'${operationalDecisionInfoObj.currency}'` : 'NULL'},
    @Unit_Price = ${operationalDecisionInfoObj?.unitPrice ?? 'NULL'},
    @Created_on = ${getFormattedDate(operationalDecisionInfoObj)},
    @CMD_Line = ${req?.body?.cmdLine ? `'${req.body.cmdLine}'` : 'NULL'}
`;

                    return sql.query(framedQuery);
                });

                const results = await Promise.all(queries);
                res.json(results.map(result => result.recordset));
            } catch (err) {
                console.error('Query failed:', err);

                if (err.originalError && err.originalError.info && err.originalError.info.message) {
                    const errorMessage = err.originalError.info.message;
                    res.status(400).send({ error: errorMessage });
                } else {
                    res.status(500).send('Internal Server Error');
                }
            }
        } else {
            res.status(400).send('cmdLine is required');
        }
    });
});
*/

const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const moment = require('moment');
const router = express.Router();

function getFormattedDate(dateStr) {
  if (!dateStr || dateStr === 'null') return null;
  const parsed = moment(dateStr, ['YYYY-MM-DD', 'MMM-YYYY'], true);
  return parsed.isValid() ? parsed.toDate() : null;
}
/*
// Format date as 'YYYY-MM-DD' string
function getFormattedDate(dateStr) {
    return dateStr && dateStr !== 'null'
        ? moment(dateStr, ['YYYY-MM-DD', 'MMM-YYYY']).format('YYYY-MM-DD')
        : null;
}
*/

// POST /api/updateOperationalDecisionInput: Body: JSON object containing batch details
    router.post('/updateOperationalDecisionInput', async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const request = pool.request();
        const OpsData = req.body;

    // Input parameters (match SP signature and Form/payload keys)
        request.input('Game_Id', sql.NVarChar, OpsData.gameId ?? null);
        request.input('Game_Batch', sql.Int, OpsData.gameBatch ?? null);
        request.input('Game_Team', sql.Int, OpsData.gameTeam ?? null);
        request.input('Production_Month', sql.Date, getFormattedDate(OpsData.productionMonth));
        request.input('Operations_Input_Id', sql.NVarChar, OpsData.operationsInputId ?? null);
        request.input('Part_no', sql.NVarChar, OpsData.partNo ?? null);
        request.input('Quantity_Id', sql.NVarChar, OpsData.quantityId ?? null);
    //    request.input('Quantity', sql.Decimal(10, 2), OpsData.quantity ?? null);
        request.input('Quantity', sql.Decimal(10, 2), 
            isFinite(Number(OpsData.quantity)) ? Number(OpsData.quantity) : null);
        request.input('Price_Id', sql.NVarChar, OpsData.priceId ?? null);
        request.input('Currency', sql.NVarChar, OpsData.currency ?? null);
    //   request.input('Unit_Price', sql.Decimal(6, 2), OpsData.unitPrice ?? null);
        request.input('Unit_Price', sql.Decimal(6, 2), 
            isFinite(Number(OpsData.unitPrice)) ? Number(OpsData.unitPrice) : null);
        request.input('Created_on', sql.Date, new Date());
        request.input('CMD_Line', sql.NVarChar, OpsData.cmdLine ?? null);

        // Output parameter
        request.output("Out_Message", sql.NVarChar(200));

    // Execute stored procedure
       const result = await request.execute("UI_Ops_Business_Plan_Trans");

        const status = result.returnValue;
        const success = status === 0;

    // Send simplified response to frontend
        res.status(success ? 200 : 400).json({
        success,
        status, // 0 = success, 1 = business rule violation, -1 = DB error
        message: result.output?.Out_Message ?? 'No message returned'
        });

    } catch (err) {
        res.status(500).json({
        success: false,
        status: -1,
        message: err.message ||'Unhandled exception'
         });
        }
        });

module.exports = router;