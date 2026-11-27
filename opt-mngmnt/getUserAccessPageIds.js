// getUserAccessPageIds.js
//  Fetch UI page IDs based on user roles (RBAC).
// Std API Format - dbConfig, Parament & datatype check, response

const express = require('express');
const sql = require('mssql');
const router = express.Router();

router.get('/getUserAccessPageIds', async (req, res) => {
  try {
    const { gameId, rlId } = req.query;

    if (!gameId || !String(gameId).trim()) {
      return res.status(400).json({ message: 'Missing Parameter' });
    }
    if (
      rlId === undefined ||
      rlId === null ||
      String(rlId).trim() === '' ||
      !Number.isInteger(Number(rlId))
    ) {
      return res.status(400).json({ message: 'Invalid RL_Id' });
    }

    // Create request
    const request = new sql.Request();

    // Map Parameters and datatypes SP Vs frontend
    request.input('Game_Id', sql.NVarChar(20), gameId);
    request.input('RL_Id', sql.Int, Number(rlId));

    // Execute stored procedure and get response
    const result = await request.execute('UI_RBAC_Screen_Info');
    res.json(result.recordset);

  } catch (err) {    // Catch error at API call level and log to console
    console.error('getUserAccessScreens Error:', err);
    res.status(500).json({ message: 'Server Error' });
  }

});

module.exports = router;
