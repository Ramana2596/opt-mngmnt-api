// opt-mngmnt/getUserAccessPageIds.js
//  Fetch UI page IDs based on user roles.
/*
const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

sql.connect(dbConfig).then(() => {
    router.get('/getUserAccessPageIds', async (req, res) => {
        try {
            const result = await sql.query(`
                SELECT [UI_Id] as uiId
                FROM [dbo].[UI_Access_Management]
                WHERE Role = '${req.query.userRole}'`);
            res.json(result.recordset);
        } catch (err) {
            console.error('Query failed:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

*/

// Purpose: Get RBAC UI screens for logged-in user (Enterprise style, standard four-line header)

const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

router.get('/getUserAccessPageIds', async (req, res) => {
  try {
    // 1. Validate input query
    const { gameId, rlId } = req.query;
    if (!gameId || !rlId) {
      return res.status(400).json({ message: 'gameId and rlId required' });
    }

    // 2. Connect to SQL Server (uses internal pool)
    await sql.connect(dbConfig);

    // 3. Create request
    const request = new sql.Request();

    // 4. Input parameters
    request.input('Game_Id', sql.NVarChar(20), gameId);
    request.input('RL_Id', sql.Int, parseInt(rlId));

    // 5. Output parameter, if needed
    // request.output('Out_Message', sql.NVarChar(200));

    // 6. Execute stored procedure
    const result = await request.execute('UI_RBAC_Screen_Info');

    // 7. Return SP output as-is (no mapping)
    res.json(result.recordset);
    
  } catch (err) {
    console.error('getUserAccessScreens Error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
