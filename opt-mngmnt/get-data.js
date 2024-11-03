const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

router.get('/products', (req, res) => {
  res.send('Get all');
});

sql.connect(dbConfig).then(() => {
    console.log('Connected');
    router.get('/data', async (req, res) => {

        try {
            // Connect to SQL Server

            const result = await sql.query`SELECT TOP (1000) [Game_Id]
      ,[Cost_Norm_Id]
      ,[Cost_Norm_Category]
      ,[Cost_Norm_Description]
      ,[UOM]
      ,[Fixed_Cost]
      ,[ Vary_Cost_Percent ]
      ,[Apply_On]
      ,[Created_By]
      ,[Created_On]
      ,[Modified_By]
      ,[Modified_On]
  FROM [OpsMgt].[dbo].[Cost_Norm_Mst]
`;
            res.json(result.recordset);
        } catch (err) {
            console.error('Query failed:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

module.exports = router;