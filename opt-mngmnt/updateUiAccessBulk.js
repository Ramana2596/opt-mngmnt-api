// Path: opt-mngmnt/updateUiAccessBulk.js
// Purpose    : Bulk update UiAccess using [UI_UI_Access_Bulk] SP
// Input      : rows (array of ui access rows), Approved_By

const express = require('express');
const sql = require('mssql');
const router = express.Router();

router.post('/updateUiAccessBulk', async (req, res) => {

    // ---- Validate required fields ----
    const { rows, approvedBy } = req.body;
    if (!rows || rows.length === 0) {
        return res.status(400).json({
            success: false,
            returnValue: 1,
            message: 'No rows to update',
        });
    }
    if (!approvedBy) {
        return res.status(400).json({
            success: false,
            returnValue: 1,
            message: 'approvedBy is required',
        });
    }
    try {
        // ---- Create SQL request ----
        const request = new sql.Request();

        // ---- Create TVP matching UiAccess_BulkType (correct types) ----
        const tvp = new sql.Table("dbo.UI_Access_BulkType");
        tvp.columns.add("Game_Id", sql.NVarChar(20));
        tvp.columns.add("RL_Id", sql.Int);
        tvp.columns.add("UI_Id", sql.NVarChar(20));
        tvp.columns.add("Permission_Enabled", sql.Bit);
        tvp.columns.add("Can_View", sql.Bit);
        tvp.columns.add("Can_Create", sql.Bit);
        tvp.columns.add("Can_Edit", sql.Bit);
        tvp.columns.add("Can_Delete", sql.Bit);
        tvp.columns.add("Can_Approve", sql.Bit);
        tvp.columns.add("Can_Execute", sql.Bit);
        tvp.columns.add("Assigned", sql.Bit);

        // ---- Populate TVP rows from frontend payload ----
        rows.forEach((r, idx) => {
            //        console.log(`Row ${idx}:`, r);
            tvp.rows.add(
                r.Game_Id,
                r.RL_Id,
                r.UI_Id,
                r.Permission_Enabled ? 1 : 0,
                r.Can_View ? 1 : 0,
                r.Can_Create ? 1 : 0,
                r.Can_Edit ? 1 : 0,
                r.Can_Delete ? 1 : 0,
                r.Can_Approve ? 1 : 0,
                r.Can_Execute ? 1 : 0,
                r.Assigned ? 1 : 0
            );
        });

        // ---- Define SP Input/Output Parameters ----
        request.input('AccessRows', tvp); // TVP input
        request.input('Approved_By', sql.Int, approvedBy);
        request.output('SucValue', sql.Int);
        request.output('Out_Message', sql.NVarChar(200));

        // ---- Execute Stored Procedure ----
        const result = await request.execute('UI_Access_Bulk');

        // ---- Extract SP return values ----
        const message = result.output?.Out_Message || 'No message returned.';
        const returnValue =
            result.output?.SucValue ?? result.returnValue ?? -1;

        // ---- Standard JSON Response ----
        res.json({
            success: returnValue === 0,
            returnValue,
            message
        });

    } catch (err) {
        console.error('SQL Error:', err);

        // ---- Standard error response ----
        res.status(500).json({
            success: false,
            returnValue: -1,
            message: 'Internal server error',
            error: err.message
        });
    }
});
module.exports = router;