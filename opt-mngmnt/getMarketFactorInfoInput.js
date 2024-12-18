const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const moment = require('moment');
const router = express.Router();

sql.connect(dbConfig).then(() => {
    router.get('/getMarketFactorInfoInput', async (req, res) => {
            try {
                const date = req?.query?.productionMonth !== 'null' ? `'${moment(req?.query?.productionMonth, 'YYYY-MM-DD').format('YYYY-MM-DD')}'` : null;
                const query = `EXEC [dbo].[UI_Market_Factor_Query]
        @Game_id = ${req?.query?.gameId !== 'null' ? `'${req?.query?.gameId}'` : null},
		@Game_Batch = ${req?.query?.gameBatch !== 'null' ? req?.query?.gameBatch : null},
		@Production_Month = ${date},
		@Market_Input_Id = ${req?.query?.marketInputId !== 'null' ? `'${req?.query?.marketInputId}'` : null},
		@Part_Category = ${req?.query?.partCategory !== 'null' ? `'${req?.query?.partCategory}'` : null},
		@Ref_Type_Info = ${req?.query?.refTypeInfo !== 'null' ? `'${req?.query?.refTypeInfo}'` : null},
		@Ref_Type_Price = ${req?.query?.refTypePrice !== 'null' ? `'${req?.query?.refTypePrice}'` : null},
		@CMD_Line = ${req?.query?.cmdLine !== 'null' ? `'${req?.query?.cmdLine}'` : null}`;
                const result = await sql.query(query);
                res.json(result.recordset);
            } catch (err) {
                console.error('Query failed:', err);
                res.status(500).send('Internal Server Error');
            }
    });
});

module.exports = router;