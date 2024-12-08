const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

sql.connect(dbConfig).then(() => {
    router.get('/getUserAccessPageIds', async (req, res) => {
            try {
                const result = await sql.query(`
SELECT [UI_Id] as uiId
  FROM [OpsMgt3].[dbo].[UI_Access_Management]
  WHERE Role = '${req.query.userRole}'`);
                res.json(result.recordset);
            } catch (err) {
                console.error('Query failed:', err);
                res.status(500).send('Internal Server Error');
            }
    });
});

module.exports = router;