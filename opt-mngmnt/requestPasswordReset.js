// file: requestPasswordReset.js
// Password reset: token generation, DB update, and email enabled, if set in .env configuration.
const express = require('express');
const sql = require('mssql');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const router = express.Router();

// Initialize SMTP Transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

router.post('/requestPasswordReset', async (req, res) => {
    try {
        // Extract parameters from request body
        const {
            gameId,
            email
        } = req.body;

        // Validate mandatory fields
        if (!gameId || !gameId.trim()) {
            return res.status(400).json({
                returnValue: -1,
                sucValue: null,
                message: 'Game Id is required'
            });
        }

        if (!email || !email.trim()) {
            return res.status(400).json({
                returnValue: -1,
                sucValue: null,
                message: 'Email is required'
            });
        }

        // Generate secure 32-byte hex token string
        const generatedToken = crypto.randomBytes(32).toString('hex');

        // Create SQL request object using application connection pool settings
        const request = new sql.Request();

        // Pass input parameters to the stored procedure
        request.input('Game_Id', sql.NVarChar(20), gameId.trim());
        request.input('User_Email', sql.NVarChar(100), email.trim());
        request.input('Generated_Token', sql.NVarChar(255), generatedToken);

        // Bind output parameters
        request.output('SucValue', sql.Int);
        request.output('Out_Message', sql.NVarChar(200));

        // Execute procedure
        const result = await request.execute('dbo.UI_Request_Password_Reset');

        const dbSucValue = result.output.SucValue;
        const dbOutMessage = result.output.Out_Message;

        // Determine if email is enabled via environment configuration
        const isEmailEnabled = process.env.ENABLE_EMAIL === 'true';

        // If token generated & email set, send email
        if (dbSucValue === 0 && isEmailEnabled) { 
            const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            const resetLink = `${baseUrl}/reset-password?token=${generatedToken}&gameId=${gameId}&email=${encodeURIComponent(email.trim())}`;
            
            // Branding change: Defined string for presentation layer matching client request
            const platformName = 'OMTP Learning Platform';

            const mailOptions = {
                from: `"OMTP Support" <${process.env.EMAIL_USER}>`, // Updated sender alias
                to: email.trim(),
                subject: 'OMTP Learning Platform - Password Reset Request', // Updated subject line
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                        <h2>Password Reset Request</h2>
                        <p>We received a request to reset your password for <strong>${platformName}</strong>. This link is valid for 1 hour.</p>
                        <div style="margin: 30px 0; text-align: center;">
                            <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reset Password</a>
                        </div>
                        <p style="color: #666; font-size: 11px;">If the button above doesn't work, copy and paste this URL into your browser:</p>
                        <p style="color: #007bff; font-size: 11px; word-break: break-all;">${resetLink}</p>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);
        }

        // Return standardized template JSON wrapper response
        return res.json({
            returnValue: result.returnValue,
            sucValue: dbSucValue,
            // Status messages
            message: dbSucValue === 0 
                ? (isEmailEnabled ? 'Reset link sent to email.' : 'Token generated (Email disabled).') 
                : dbOutMessage
        });

    } catch (err) {
        return res.status(500).json({
            returnValue: -1,
            sucValue: null,
            message: `Server error: ${err.message}`
        });
    }
});

module.exports = router;