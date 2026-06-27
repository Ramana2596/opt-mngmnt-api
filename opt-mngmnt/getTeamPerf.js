// File : getTeamPerf.js
// Purpose : Team Performance Dashboard

const express = require("express");
const sql = require("mssql");

const router = express.Router();

router.get("/getTeamPerf", async (req, res) => {

    try {

        // Read Parameters
        const gameId = req.query.gameId;
        const gameBatch = parseInt(req.query.gameBatch, 10);
        const gameTeam = req.query.gameTeam;

        // Validation
        if (!gameId || !gameTeam || Number.isNaN(gameBatch)) {
            return res.status(400).json({
                success: false,
                message: "Invalid input parameters."
            });
        }

        const request = new sql.Request();

        request.input("Game_Id", sql.NVarChar(20), gameId);
        request.input("Game_Batch", sql.Int, gameBatch);
        request.input("Game_Team", sql.NVarChar(10), gameTeam);

        const result = await request.execute("UI_TA_Perf_Query");

        const recordsets = result?.recordsets || [];

        res.status(200).json({
            success: true,

            header: recordsets?.[0]?.[0] || null,
            yardsticks: recordsets?.[1] || [],
            ratios: recordsets?.[2] || [],
            allTeams: recordsets?.[3] || []
        });

    }
    catch (err) {

        console.error("UI_TA_Perf_Query Error:", err);

        res.status(500).json({
            success: false,
            message: "Unable to retrieve Team Performance.",
            error: err.message
        });

    }

});

module.exports = router;