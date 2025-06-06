const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

sql.connect(dbConfig).then(() => {
    router.get('/getUserInfo', async (req, res) => {
        try {
            const cmdLine = req.query.cmdLine || '';
            if (cmdLine === 'Get_User') {
                const result = await sql.query(`
                EXEC [dbo].[UI_User_Role_Query]
                @Game_Id = '${req.query.gameId}',
                @User_Id= NULL,
	            @PF_Id = NULL,
	            @CMD_Line = ${cmdLine}
                `);
                res.json(result.recordset);
            } else if (cmdLine === 'Get_Valid_Roles') {
                const result = await sql.query(`
                EXEC [dbo].[UI_User_Role_Query]
                @Game_Id = '${req.query.gameId}',
                @User_Id= NULL,
	            @PF_Id = ${req.query.pfId ? `'${req.query.pfId}'` : 'NULL'},
	            @CMD_Line = ${cmdLine}
                `);
                res.json(result.recordset);
            } else if (cmdLine === 'Get_Approved_Roles') {
                const result = await sql.query(`
                EXEC [dbo].[UI_User_Role_Query]
                @Game_Id = '${req.query.gameId}',
                @User_Id= ${req.query.userId ? `'${req.query.userId}'` : 'NULL'},
	            @PF_Id = ${req.query.pfId ? `'${req.query.pfId}'` : 'NULL'},
	            @CMD_Line = ${cmdLine}
                `);
                res.json(result.recordset);
            }

        } catch (err) {
            console.error('Query failed:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

module.exports = router;
