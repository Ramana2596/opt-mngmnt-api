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

module.exports = router;
