// userFeedback.js
const express      = require('express');
const router       = express.Router();
const sql          = require('mssql');
const { getPool }  = require('../db/pool');

// ── POST /api/feedback  cmdLine: Get_Config | Submit ─────────────────
router.post('/', async (req, res) => {
    const { cmdLine } = req.body;

    // Route to handler based on cmdLine
    if (cmdLine === 'Get_Config') return handleGetConfig(req, res);
    if (cmdLine === 'Submit')     return handleSubmit(req, res);

    return res.status(400).json({ returnStatus: 1, message: 'Invalid cmdLine.' });
});

// ── Fetch widgets and options 
async function handleGetConfig(req, res) {
    try {
        const pool   = await getPool();
        const result = await pool.request().execute('UI_Feedback_Query');

        // ResultSet 0 = widgets, ResultSet 1 = options
        return res.json({
            returnStatus : 0,
            widgets      : result.recordsets[0],
            options      : result.recordsets[1],
        });

    } catch (err) {
        console.error('[Feedback_Query Error]', err.message);
        return res.status(500).json({ returnStatus: -1, message: 'Failed to load feedback config.' });
    }
}

// ── Submit: record feedback row 
async function handleSubmit(req, res) {
    const { userId, uiId, feedbackWidgetId, feedbackOptionId, feedback, rating } = req.body;

    // Basic validation before hitting DB
    if (!userId || !uiId || !feedbackWidgetId || !feedbackOptionId) {
        return res.status(400).json({ returnStatus: 1, message: 'Missing required feedback fields.' });
    }

    try {
        const pool    = await getPool();
        const request = pool.request();

        // Input parameters
        request.input('User_Id',            sql.Int,            userId);
        request.input('UI_Id',              sql.NVarChar(20),   uiId);
        request.input('Feedback_Widget_Id', sql.TinyInt,        feedbackWidgetId);
        request.input('Feedback_Option_Id', sql.TinyInt,        feedbackOptionId);
        request.input('Feedback',           sql.NVarChar(2000), feedback  || null);
        request.input('Rating',             sql.TinyInt,        rating    || null);

        // Output parameters
        request.output('SucValue',    sql.Int);
        request.output('Out_Message', sql.NVarChar(200));

        const result     = await request.execute('UI_Feedback_Trans');
        const sucValue   = result.output.SucValue;
        const outMessage = result.output.Out_Message;

        if (sucValue === 0) {
            return res.json({ returnStatus: 0, message: outMessage });
        } else {
            return res.status(422).json({ returnStatus: sucValue, message: outMessage });
        }

    } catch (err) {
        console.error('[Feedback Submit Error]', err.message);
        return res.status(500).json({ returnStatus: -1, message: 'Internal server error.' });
    }
}

module.exports = router;
