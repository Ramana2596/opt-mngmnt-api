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
                        @Game_Id = '${marketFactorInfoObj?.gameId}',
	                    @Game_Batch = ${marketFactorInfoObj?.gameBatch},
	                    @Production_Month =  ${getFormattedDate(marketFactorInfoObj)},
	                    @Market_Input_Id = '${marketFactorInfoObj?.marketInputId}',
	                    @Part_no = '${marketFactorInfoObj?.partNo}',
	                    @Quantity_Id = '${marketFactorInfoObj?.quantityId}',
	                    @Quantity = ${marketFactorInfoObj?.quantity},
	                    @Price_Id = '${marketFactorInfoObj?.priceId}',
	                    @Currency = '${marketFactorInfoObj?.currency}',
	                    @Unit_Price = ${marketFactorInfoObj?.unitPrice},
                        @Created_on = ${getFormattedDate(marketFactorInfoObj)},
	                    @CMB_Line = '${req?.body?.cmdLine}'
                    `;
                    console.log(framedQuery);
                    return sql.query(framedQuery);
                });

                const results = await Promise.all(queries);
                res.json(results.map(result => result.recordset));
            } catch (err) {
                console.error('Query failed:', err);
                res.status(500).send('Internal Server Error');
            }
        }
    });
});

module.exports = router;
