// userFeedback.js 
// Get user feedback config and add feedback

const express = require('express');
const router  = express.Router();
const sql     = require('mssql');

// Route POST  — handler based on cmdLine
router.post('/userFeedback', async (req, res) => {
    const { cmdLine } = req.body;

    if (cmdLine === 'Get_Config') return handleGetConfig(req, res);
    if (cmdLine === 'Submit')     return handleSubmit(req, res);

    return res.status(400).json({ returnStatus: 1, message: 'Invalid cmdLine.' });
});

// Fetch feedback widgets and options from DB
async function handleGetConfig(req, res) {
    try {
        const result = await new sql.Request().execute('UI_Feedback_Query');

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

// Validate and Add record to DB
async function handleSubmit(req, res) {
    const { userId, uiId, feedbackWidgetId, feedbackOptionId, feedback, rating } = req.body;

    // Reject if required fields are missing
    if (!userId ) {
        return res.status(400).json({ returnStatus: 1, message: 'Please log in.' });
    }
    if (!userId || !feedbackWidgetId || !feedbackOptionId) {
        return res.status(400).json({ returnStatus: 1, message: 'Missing required feedback fields.' });
    }

    try {
        // Payload matching SP 
        const request = new sql.Request();

        request.input('User_Id',            sql.Int,            userId);
        request.input('UI_Id',              sql.NVarChar(20),   uiId);
        request.input('Feedback_Widget_Id', sql.TinyInt,        feedbackWidgetId);
        request.input('Feedback_Option_Id', sql.TinyInt,        feedbackOptionId);
        request.input('Feedback',           sql.NVarChar(2000), feedback  || null);
        request.input('Rating',             sql.TinyInt,        rating    || null);

        request.output('SucValue',    sql.Int);
        request.output('Out_Message', sql.NVarChar(200));

        // Execute SP and return result
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