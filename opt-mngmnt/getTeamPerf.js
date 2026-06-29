// File : getTeamPerf.js

const express = require("express");
const sql = require("mssql");
const router = express.Router();

router.get("/getTeamPerf", async (req, res) => {
    try {

        const gameId = req.query.gameId || null;
        const gameBatch = req.query.gameBatch
            ? parseInt(req.query.gameBatch, 10)
            : null;
        const gameTeam = req.query.gameTeam || null;
        const cmdLine = req.query.cmdLine;

        if (!cmdLine) {
            return res.status(400).json({
                success: false,
                message: "cmdLine is required."
            });
        }

        const request = new sql.Request();

        request.input("Game_Id", sql.NVarChar(20), gameId);
        request.input("Game_Batch", sql.Int, gameBatch);
        request.input("Game_Team", sql.NVarChar(10), gameTeam);
        request.input("CMD_Line", sql.NVarChar(50), cmdLine);

        const result = await request.execute("UI_TA_Perf_Query");
        
// Pass the result to correct recordset name
        switch (cmdLine) {

            case "Get_Batch":
                return res.json({
                    success: true,
                    data: result.recordset || []
                });

            case "Get_Team":
                return res.json({
                    success: true,
                    allTeams: result.recordset || []
                });

            case "Get_Team_Perf":
                return res.json({
                    success: true,
                    header: result.recordsets?.[0]?.[0] || null,
                    yardsticks: result.recordsets?.[1] || [],
                    ratios: result.recordsets?.[2] || []
                });

            default:
                return res.status(400).json({
                    success: false,
                    message: "Invalid cmdLine."
                });
        }

    } catch (err) {

        console.error("UI_TA_Perf_Query Error:", err);

        res.status(500).json({
            success: false,
            message: "Unable to retrieve Team Performance.",
            error: err.message
        });
    }
});

module.exports = router;