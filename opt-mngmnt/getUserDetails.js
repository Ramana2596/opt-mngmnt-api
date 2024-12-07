const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

sql.connect(dbConfig).then(() => {
    router.get('/getUserDetails', async (req, res) => {
            try {
                const result = await sql.query(`DECLARE @User_Email nvarchar(50)
SET @User_Email = '${req.query.userEmail}'
SELECT [Game_Id] as gameId
      ,[User_Login] as userEmail
      ,[Role] as role
  FROM [OpsMgt3].[dbo].[User_Role_Mst]
	WHERE [User_Login] = @User_Email`);
                res.json(result.recordset);
            } catch (err) {
                console.error('Query failed:', err);
                res.status(500).send('Internal Server Error');
            }
    });
});

module.exports = router;