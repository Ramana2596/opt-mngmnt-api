// updateUserRole.js
// Process multiple user role transactions

const express = require('express');
const sql = require('mssql');
const router = express.Router();

// Update multiple user roles via a command list
router.post('/updateUserRole', async (req, res) => {
    try {
        const { userRoleList } = req.body;

        // Validate payload is a valid non-empty array
        if (!Array.isArray(userRoleList) || userRoleList.length === 0) {
            return res.status(400).json({
                returnValue: 400,
                Message: "User Role List is required !.",
                Data: []
            });
        }

        const results = [];
        let lastOutput = { message: "Success", sucValue: 0 };

        // Process each Role from List
        for (const item of userRoleList) {
            
            const request = new sql.Request();

            // Mapping Frontend keys to Stored Procedure inputs
            request.input('Game_Id', sql.NVarChar(20), item.gameId);
            request.input('User_Id', sql.Int, item.userId ? Number(item.userId) : null);
            request.input('RL_Id', sql.Int, item.roleId ? Number(item.roleId) : null);
            request.input('Created_By', sql.NVarChar(50), item.approvedUserId ? item.approvedUserId : null);
            request.input('CMD_Line', sql.NVarChar(50), item.cmdLine);

            // Optional Output Parameters for SP feedback
            request.output('Out_Message', sql.NVarChar(200));
            request.output('SucValue', sql.Int);

            // Execute the Transaction SP
            const result = await request.execute('UI_User_Role_Trans');

            // Store status for the final response
            lastOutput.message = result.output?.Out_Message || "Processed";
            lastOutput.sucValue = (result.output?.SucValue !== undefined && result.output?.SucValue !== null)
                ? result.output.SucValue 
                : (result.returnValue ?? 0);

            results.push(result.recordset || []);
        }

        // Send consolidated response
        res.json({
            returnValue: lastOutput.sucValue,
            Message: lastOutput.message,
            Data: results
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

module.exports = router;
