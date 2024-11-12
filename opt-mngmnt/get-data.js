const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

sql.connect(dbConfig).then(() => {
    router.get('/data', async (req, res) => {

        try {
            // Connect to SQL Server

            const result = await sql.query`SELECT TOP (1000) [Game_Id]
      ,[Game_Title]
      ,[Game_Short_Title]
      ,[Game_Objective]
      ,[Discipline]
      ,[Subject]
      ,[Faculty]
      ,[Duration_Hours]
      ,[Max_Seats]
      ,[Max_Sessions]
  FROM [OpsMgt].[dbo].[Game_Mst]
`;
            res.json(result.recordset);
        } catch (err) {
            console.error('Query failed:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

module.exports = router;