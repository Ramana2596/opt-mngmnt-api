// ============================================================
// LEAP V1.1
// File : getLeap.js
// Purpose : Retrieve LEAP (Simumation) Stage and Help information
// ============================================================

const express = require("express");
const sql = require("mssql");
const router = express.Router();

// ============================================================
// GET LEAP Information
// ============================================================

router.get("/getLeap", async (req, res) => {

    try {

        // Read request parameters
        const stageId = req.query.stageId
            ? parseInt(req.query.stageId, 10)
            : null;

        const cmdLine = req.query.cmdLine;

        // Validate mandatory parameter
        if (!cmdLine) {
            return res.status(400).json({
                success: false,
                message: "cmdLine is required."
            });
        }

        // Create SQL request
        const request = new sql.Request();

        request.input("Stage_Id", sql.Int, stageId);
        request.input("CMD_Line", sql.NVarChar(50), cmdLine);

        request.output("SucValue", sql.Int);
        request.output("Out_Message", sql.NVarChar(100));

        // Execute stored procedure
        const result = await request.execute("UI_Leap_Query");

        // Business validation
        if (result.output.SucValue !== 0) {
            return res.json({
                success: false,
                message: result.output.Out_Message
            });
        }

        // Return response
        switch (cmdLine) {

            case "Get_Stage":

                return res.json({
                    success: true,
                    stages: result.recordset || []
                });

            case "Get_Help":

                return res.json({
                    success: true,
                    help: result.recordset || []
                });

            default:

                return res.status(400).json({
                    success: false,
                    message: "Invalid cmdLine."
                });
        }

    }
    catch (err) {

        console.error("UI_Leap_Query Error :", err);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve LEAP information.",
            error: err.message
        });

    }

});

// ============================================================

module.exports = router;