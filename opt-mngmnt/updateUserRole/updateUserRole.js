const express = require('express');
const sql = require('mssql');
const dbConfig = require('../../dbConfig');
const router = express.Router();

sql.connect(dbConfig).then(() => {
    router.post('/updateUserRole', async (req, res) => {
        try {
            const userRoleList = req?.body?.userRoleList;
            if (!Array.isArray(userRoleList) || userRoleList.length === 0) {
                return res.status(400).json({ message: 'userRoleList is required and should be a non-empty array.' });
            }

            // 1. Execute the delete operation once before the loop
            const deleteQuery = `
                EXEC [dbo].[UI_User_Role_Trans]
                   @Game_Id = ${userRoleList[0]?.gameId ? `${userRoleList[0].gameId}` : 'NULL'},
                   @User_Id = ${userRoleList[0]?.userId ? userRoleList[0].userId : 'NULL'},
                   @RL_Id = NULL,
                   @CMD_Line = 'Delete_Role'
            `;
            try {
                await sql.query(deleteQuery);
            } catch (err) {
                return res.status(500).json({
                    message: err.message || 'Database error during delete operation',
                    failedUserRole: userRoleList[0]
                });
            }

            // 2. Proceed with the recursive operation for each userRoleObj
            const results = [];
            for (const userRoleObj of userRoleList) {
                const framedQuery = `
                EXEC [dbo].[UI_User_Role_Trans]
                   @Game_Id = ${userRoleObj?.gameId ? `${userRoleObj.gameId}` : 'NULL'},
                   @User_Id = ${userRoleObj?.userId ? userRoleObj.userId : 'NULL'},
                   @RL_Id = ${userRoleObj?.roleId ? userRoleObj.roleId : 'NULL'},
                   @CMD_Line = '${userRoleObj?.cmdLine ? userRoleObj.cmdLine : 'NULL'}'
                `;
                try {
                    const result = await sql.query(framedQuery);
                    results.push({ success: true, data: result.recordset });
                } catch (err) {
                    // On first failure, send error and stop processing further
                    return res.status(500).json({
                        message: err.message || 'Database error',
                        failedUserRole: userRoleObj
                    });
                }
            }

            // If all succeed, send a single success object
            res.json({
                success: true,
                results
            });

        } catch (err) {
            console.error('Query failed:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

module.exports = router;
