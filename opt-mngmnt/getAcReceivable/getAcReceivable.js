const express = require('express');
const sql = require('mssql');
const dbConfig = require('../../dbConfig');
const router = express.Router();

sql.connect(dbConfig).then(() => {
    router.get('/getAcReceivable', async (req, res) => {
        try {
            const query = `EXEC [dbo].[UI_Ac_Receivable] 
                                @Game_Id = '${req.query.gameId}',
                                @Game_Batch = ${req.query.gameBatch},
                                @Game_Team = '${req.query.gameTeam}'`;
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