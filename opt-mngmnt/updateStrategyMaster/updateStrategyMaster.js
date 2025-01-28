const express = require('express');
const sql = require('mssql');
const dbConfig = require('../../dbConfig');
const moment = require('moment');
const router = express.Router();

function getFormattedDate(marketFactorInfoObj) {
    const date = marketFactorInfoObj?.productionMonth !== 'null' ? `'${moment(marketFactorInfoObj?.productionMonth, 'YYYY-MM-DD').format('YYYY-MM-DD')}'` : null;
    return date;
}

sql.connect(dbConfig).then(() => {
    router.post('/updateStrategyMaster', async (req, res) => {
        if (req?.body?.cmdLine) {
            const strategyMaster = req?.body?.strategyMasterArray;

            try {
                const queries = strategyMaster.map(strategyMasterObj => {
                    const framedQuery = `
                    EXEC [dbo].[UI_Strategy_Mst_Trans] 
                        @Game_Id = ${strategyMasterObj?.gameId ? `'${strategyMasterObj.gameId}'` : 'NULL'},
                        @Strategy_Id = ${strategyMasterObj?.strategyId ? `'${strategyMasterObj.strategyId}'` : 'NULL'},
                        @Strategy_Description = ${strategyMasterObj?.strategyDescription ? `'${strategyMasterObj.strategyDescription}'` : 'NULL'},
                        @Business_Enabler = ${strategyMasterObj?.businessEnabler ? `'${strategyMasterObj.businessEnabler}'` : 'NULL'},
                        @Cost_Type = ${strategyMasterObj?.costType ? `'${strategyMasterObj.costType}'` : 'NULL'},
                        @Mutual_X_Group = ${strategyMasterObj?.mutualGroup ? `'${strategyMasterObj.mutualGroup}'` : 'NULL'},
                        @Created_by = 'System User',
                        @CMB_Line = ${req?.body?.cmdLine ? `'${req.body.cmdLine}'` : 'NULL'}
                    `;
                    if (req?.body?.cmdLine === 'Delete_Strategy') {
                        console.log(framedQuery);
                    }
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
