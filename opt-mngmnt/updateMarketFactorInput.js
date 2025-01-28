const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const moment = require('moment');
const router = express.Router();

function getFormattedDate(marketFactorInfoObj) {
    const date = marketFactorInfoObj?.productionMonth !== 'null' ? `'${moment(marketFactorInfoObj?.productionMonth, 'YYYY-MM-DD').format('YYYY-MM-DD')}'` : null;
    return date;
}

sql.connect(dbConfig).then(() => {
    router.post('/updateMarketFactorInput', async (req, res) => {
        if (req?.body?.cmdLine) {
            const marketFactorInfo = req?.body?.marketFactorInfoArray;

            try {
                const queries = marketFactorInfo.map(marketFactorInfoObj => {
                    const framedQuery = `
EXEC [dbo].[UI_Market_Factor_Trans]
    @Game_Id = ${marketFactorInfoObj?.gameId ? `'${marketFactorInfoObj.gameId}'` : 'NULL'},
    @Game_Batch = ${marketFactorInfoObj?.gameBatch ?? 'NULL'},
    @Production_Month = ${getFormattedDate(marketFactorInfoObj)},
    @Market_Input_Id = ${marketFactorInfoObj?.marketInputId ? `'${marketFactorInfoObj.marketInputId}'` : 'NULL'},
    @Part_no = ${marketFactorInfoObj?.partNo ? `'${marketFactorInfoObj.partNo}'` : 'NULL'},
    @Quantity_Id = ${marketFactorInfoObj?.quantityId ? `'${marketFactorInfoObj.quantityId}'` : 'NULL'},
    @Quantity = ${marketFactorInfoObj?.quantity ?? 'NULL'},
    @Price_Id = ${marketFactorInfoObj?.priceId ? `'${marketFactorInfoObj.priceId}'` : 'NULL'},
    @Currency = ${marketFactorInfoObj?.currency ? `'${marketFactorInfoObj.currency}'` : 'NULL'},
    @Unit_Price = ${marketFactorInfoObj?.unitPrice ?? 'NULL'},
    @Created_on = ${getFormattedDate(marketFactorInfoObj)},
    @CMB_Line = ${req?.body?.cmdLine ? `'${req.body.cmdLine}'` : 'NULL'}
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
