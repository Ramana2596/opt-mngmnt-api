
// File: authRoutes.js
// Purpose: OAuth routes (Google, Microsoft, LinkedIn, Facebook)

const express = require("express");
const passport = require("./authFramework");
const router = express.Router();

// FRONTEND BASE URL
// Centralized frontend redirect target
const FRONTEND_URL =
  process.env.FRONTEND_URL || "https://appomgplatform.vercel.app";

// SUCCESS REDIRECT HANDLER

// Send user back to frontend after successful login
function redirectSuccess(req, res, provider) {
  const userId = req.user?.User_Id;

  return res.redirect(
    `${FRONTEND_URL}/authHubPage` +
    `?status=success` +
    `&provider=${provider}` +
    `&userId=${encodeURIComponent(userId)}`
  );
}

// GOOGLE OAUTH
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failure" }),
  (req, res) => redirectSuccess(req, res, "google")
);

//  MICROSOFT OAUTH
router.get(
  "/auth/microsoft",
  passport.authenticate("microsoft", { scope: ["user.read"] })
);

router.get(
  "/auth/microsoft/callback",
  passport.authenticate("microsoft", { failureRedirect: "/auth/failure" }),
  (req, res) => redirectSuccess(req, res, "microsoft")
);

// LINKEDIN OAUTH
router.get(
  "/auth/linkedin",
  passport.authenticate("linkedin")
);

router.get(
  "/auth/linkedin/callback",
  passport.authenticate("linkedin", { failureRedirect: "/auth/failure" }),
  (req, res) => redirectSuccess(req, res, "linkedin")
);

// FACEBOOK OAUTH
router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/auth/failure" }),
  (req, res) => redirectSuccess(req, res, "facebook")
);

// FAILURE HANDLING
// Unified failure response to frontend
router.get("/auth/failure", (req, res) => {
  res.redirect(
    `${FRONTEND_URL}/authHubPage?status=failure&reason=oauth_failed`
  );
});

// LEGACY SUPPORT (OPTIONAL)
router.get("/auth/success", (req, res) => {
  res.redirect(`${FRONTEND_URL}/authHubPage?status=success`);
});

module.exports = router;