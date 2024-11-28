const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

let getFramedParams = ((cmdLineType) => {
    switch (cmdLineType) {
        case 'getBatch':
            return {
                gameBatch: null,
                cmdLine: 'Get_Batch'
            };
        case 'getMarketInputId':
            return {
                gameBatch: null,
                cmdLine: 'Get_Market_Input_Id'
            };
        case 'getPeriod':
            return {
                cmdLine: 'Get_Period'
            };
        case 'getMarketInfo':
            return {
                gameBatch: null,
                cmdLine: 'Get_Market_Info'
            };
        case 'getPart':
            return {
                gameBatch: null,
                cmdLine: 'Get_Part'
            };
        case 'getQtyId':
            return {
                gameBatch: null,
                cmdLine: 'Get_Qty_Id'
            };
        case 'getPriceId':
            return {
                gameBatch: null,
                cmdLine: 'Get_Price_Id'
            };

    }
});

sql.connect(dbConfig).then(() => {
    router.get('/getMarketFactorInfoInput', async (req, res) => {
        if (req?.query?.type) {
            let queryParams = {
                gameId: req?.query?.gameId,
                gameBatch: req?.query?.gameBatch,
                cmdLine: '',
                ...getFramedParams(req?.query?.type)
            };
            try {
                const result = await sql.query(`DECLARE @Game_Id NVARCHAR(20)
    DECLARE @Game_Batch SMALLINT
    SET @Game_Id = '${queryParams.gameId}'
    SET @Game_Batch = ${queryParams.gameBatch}
   EXEC [dbo].[UI_MktLead_Demand_Query] 
        @Game_Id = @Game_Id,
        @Game_Batch = @Game_Batch,
        @CMD_Line = '${queryParams.cmdLine}'`);
                res.json(result.recordset);
            } catch (err) {
                console.error('Query failed:', err);
                res.status(500).send('Internal Server Error');
            }
        }
    });
});

module.exports = router;