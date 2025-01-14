const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const moment = require('moment');
const router = express.Router();

sql.connect(dbConfig).then(() => {
    router.get('/getMarketFactorInfoInput', async (req, res) => {
            try {
                //Convert recieved date into SQL readable format
                const date = req?.query?.productionMonth ? `'${moment(req?.query?.productionMonth, 'YYYY-MM-DD').format('YYYY-MM-DD')}'` : null;
                //Frame SQL query to get executed
                const query = `EXEC [dbo].[UI_Market_Factor_Query]
                                    @Game_id = ${req?.query?.gameId ? `'${req?.query?.gameId}'` : null},
		                            @Game_Batch = ${req?.query?.gameBatch ? req?.query?.gameBatch : null},
		                            @Production_Month = ${date},
		                            @Market_Input_Id = ${req?.query?.marketInputId ? `'${req?.query?.marketInputId}'` : null},
		                            @Part_Category = ${req?.query?.partCategory ? `'${req?.query?.partCategory}'` : null},
		                            @Ref_Type_Info = ${req?.query?.refTypeInfo ? `'${req?.query?.refTypeInfo}'` : null},
		                            @Ref_Type_Price = ${req?.query?.refTypePrice ? `'${req?.query?.refTypePrice}'` : null},
		                            @CMD_Line = ${req?.query?.cmdLine ? `'${req?.query?.cmdLine}'` : null}`;
                const result = await sql.query(query);
                res.json(result.recordset);
            } catch (err) {
              console.error('Query failed:', err);

              if (err.originalError && err.originalError.info && err.originalError.info.message) {
                  const errorMessage = err.originalError.info.message;
                  res.status(400).send({ error: errorMessage });
              } else {
                  res.status(500).send('Internal Server Error');
              }
            }
    });
});

module.exports = router;