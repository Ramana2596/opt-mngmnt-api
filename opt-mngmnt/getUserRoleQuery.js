// getUserRoleQuery.js

// Standardized: returnValue (from @SucValue), Message, Data

const express = require('express');
const sql = require('mssql');
//const dbConfig = require('../dbConfig');

const router = express.Router();

//sql.connect(dbConfig).then(() => {

    router.post('/getUserRoleQuery', async (req, res) => {
        try {
            const { gameId, userId, pfId, cmdLine } = req.body;

            if (!gameId || !cmdLine) {
                return res.status(400).json({
                    returnValue: 400,
                    Message: "Missing Parameters",
                    Data: []
                });
            }

            const request = new sql.Request();

            // SP Inputs 
            request.input('Game_Id', sql.NVarChar(20), gameId);
            request.input('User_Id', sql.Int, userId ? Number(userId) : null);
            request.input('PF_Id', sql.Int, pfId ? Number(pfId) : null);
            request.input('CMD_Line', sql.NVarChar(50), cmdLine);

            // Define Output Parameters (ignored if not used in SP )
            request.output('Out_Message', sql.NVarChar(200));
            request.output('SucValue', sql.Int);

            // Execute SP
            const result = await request.execute('UI_User_Role_Query');

            // --- REPORT SP RESULTS
            // Prioritize @SucValue over standard returnValue
            const finalReturn = (result.output?.SucValue !==
                undefined && result.output?.SucValue !== null)
                ? result.output.SucValue
                : (result.returnValue ?? 0);

            res.json({
                returnValue: finalReturn,
                Message: result.output?.Out_Message || "",
                Data: result.recordset || []
            });

        } catch (err) {
            console.error('System Error:', err);

            res.status(500).json({
                returnValue: err.number || 500,
                Message: err.message || "Internal Server Error",
                Data: []
            });
        }
    });

//}).catch(err => {
//    console.error('DB Connection Failed:', err);
//});

module.exports = router;

/*
const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');

const router = express.Router();

// DB connection at app startup (not per request)
sql.connect(dbConfig).then(() => {

    router.post('/getUserRoleQuery', async (req, res) => {
        try {
            const { gameId, userId, pfId, cmdLine } = req.body;

            if (!gameId || !cmdLine) {
                return res.status(400).json({
                    success: false,
                    code: -1,
                    message: "Missing Parameters",
                });
            }
            const request = new sql.Request();

            // SP input parameters : Pass values or NULL if not required
            request.input('Game_Id', sql.NVarChar(20), gameId);
            request.input('User_Id', sql.Int, userId ? Number(userId) : null);
            request.input('PF_Id', sql.Int, pfId ? Number(pfId) : null);
            request.input('CMD_Line', sql.NVarChar(50), cmdLine);

            // SP output parameter
            //request.output('Out_Message', sql.NVarChar(200));

            // Execute SP
            const result = await request.execute('UI_User_Role_Query');

            // Extract return code, message, and data
            res.json(result.recordset);
            //const code = result.returnValue ?? 0;
            //const message = result.output?.Out_Message || '';
            //const data = result.recordset?.[0] || null;

            // Normal business response
            //res.json({ success: code === 0, code, message, data });

        } catch (err) {
            // SQL Error SP execution (THROW 50001)
            console.error('SQL Error:', err);
            //res.status(500).json({ success: false, code: -1, message: err.message });
            res.status(500).send('Internal Server Error');
        }
    });

}).catch(err => {
    // NW / DB onnection failure at application startup
    console.error('DB Connection Failed:', err);
});

module.exports = router;
*/


/*
const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const router = express.Router();

sql.connect(dbConfig).then(() => {
    router.get('/getUserRoleQuery', async (req, res) => {
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
*/
