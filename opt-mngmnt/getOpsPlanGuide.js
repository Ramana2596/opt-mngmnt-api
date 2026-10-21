
// File: getOpsPlanGuide.js
// Purpose: Return TeamPlan guide figures from five stored-procedure result sets.
// AI Tags: team-plan, guide, stored-procedure, api

const express = require("express");
const sql = require("mssql");
const router = express.Router();

router.get("/getOpsPlanGuide", async (req, res) => {
    try {
        const gameId = req.query.gameId || null;
        const gameBatch = req.query.gameBatch
            ? parseInt(req.query.gameBatch, 10)
            : null;
        const gameTeam = req.query.gameTeam || null;
        const productionMonth = req.query.productionMonth || null;

        // Validate the required procedure parameters.
        if (
            !gameId ||
            !Number.isInteger(gameBatch) ||
            !gameTeam ||
            !productionMonth ||
            !/^\d{4}-\d{2}-\d{2}$/.test(productionMonth)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid Values for parameters"
            });
        }

        // Bind inputs and execute the stored procedure.
        const request = new sql.Request();

        request.input("Game_Id", sql.NVarChar(20), gameId);
        request.input("Game_Batch", sql.Int, gameBatch);
        request.input("Game_Team", sql.NVarChar(20), gameTeam);
        request.input("Production_Month", sql.Date, productionMonth);

        const result = await request.execute("dbo.UI_Ops_Business_Plan_Guide");
        
        console.log("Guide recordsets:", {
            count: result.recordsets?.length,
            rowsPerSet: result.recordsets?.map((set) => set.length),
            columnsPerSet: result.recordsets?.map((set) =>
                set.length ? Object.keys(set[0]) : []
            )
        });

        // Return all five result sets without losing their boundaries.
        return res.json({
            success: true,
            demand: result.recordsets?.[0] || [],
            fgStock: result.recordsets?.[1] || [],
            rmStock: result.recordsets?.[2] || [],
            bom: result.recordsets?.[3] || [],
            plant: result.recordsets?.[4] || []
        });

    } catch (err) {
        console.error("TeamPlan Guide API Error:", err);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve TeamPlan guide figures.",
            error: err.message
        });
    }
});

module.exports = router;