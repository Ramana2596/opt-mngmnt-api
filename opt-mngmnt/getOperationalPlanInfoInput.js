const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const moment = require('moment');
const router = express.Router();

sql.connect(dbConfig).then(() => {
    router.get('/getOperationalPlanInfoInput', async (req, res) => {
            try {
                //Convert recieved date into SQL readable format
                const date = req?.query?.productionMonth ? `'${moment(req?.query?.productionMonth, 'YYYY-MM-DD').format('YYYY-MM-DD')}'` : null;
                //Frame SQL query to get executed
                const query = `EXEC [dbo].[UI_Ops_Business_Plan_Query]
                                    @Game_id = ${req?.query?.gameId ? `'${req?.query?.gameId}'` : null},
		                            @Game_Batch = ${req?.query?.gameBatch ? req?.query?.gameBatch : null},
                                    @Game_Team = ${req?.query?.gameTeam ? req?.query?.gameTeam : null},
		                            @Production_Month = ${date},
                                    @Operations_Input_Id = ${req?.query?.operationsInputId ? `'${req?.query?.operationsInputId}'` : null},
		                            @Part_Category = ${req?.query?.partCategory ? `'${req?.query?.partCategory}'` : null},
		                            @Ref_Type_Info = ${req?.query?.refTypeInfo ? `'${req?.query?.refTypeInfo}'` : null},
		                            @Ref_Type_Price = ${req?.query?.refTypePrice ? `'${req?.query?.refTypePrice}'` : null},
                                    @Market_Input_Id = ${req?.query?.marketInputId ? `'${req?.query?.marketInputId}'` : null},
		                            @CMD_Line = ${req?.query?.cmdLine ? `'${req?.query?.cmdLine}'` : null}`;
                console.log(query);
                const result = await sql.query(query);
                res.json(result.recordset);
            } catch (err) {
                console.error('Query failed:', err);
                res.status(500).send('Internal Server Error');
            }
    });
});

module.exports = router;