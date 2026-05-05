// File: authRoutes.js
// Purpose: OAuth routes (Google, Microsoft, LinkedIn, Facebook)

const express = require("express");
const passport = require("./authFramework");
const router = express.Router();

 //  FRONTEND BASE URL CONFIG  
if (!process.env.FRONTEND_URL) {  
  throw new Error("FRONTEND_URL is required in environment variables");  
}

const FRONTEND_URL = process.env.FRONTEND_URL;  

 //  CHECK IF OAUTH STRATEGY IS REGISTERED
function isProviderEnabled(name) {
  try {
    return passport._strategies && passport._strategies[name];
  } catch (err) {
    return false;
  }
}

 //  SUCCESS: Then Redirect to frontend
function redirectSuccess(req, res, provider) {
  const userId = req.user?.User_Id || "";  // safe fallback for runtime only

  return res.redirect(
    `${FRONTEND_URL}/authHubPage` +
    `?status=success` +
    `&provider=${provider}` +
    `&userId=${encodeURIComponent(userId)}`
  );
}

 //  GOOGLE OAUTH ROUTES
if (isProviderEnabled("google")) {

  router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  router.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/auth/failure" }),
    (req, res) => redirectSuccess(req, res, "google")
  );

} else {
  console.warn("[AUTH ROUTES] Google auth disabled (strategy missing)");
}

 //  MICROSOFT OAUTH ROUTES
if (isProviderEnabled("microsoft")) {

  router.get(
    "/auth/microsoft",
    passport.authenticate("microsoft", { scope: ["user.read"] })
  );

  router.get(
    "/auth/microsoft/callback",
    passport.authenticate("microsoft", { failureRedirect: "/auth/failure" }),
    (req, res) => redirectSuccess(req, res, "microsoft")
  );

} else {
  console.warn("[AUTH ROUTES] Microsoft auth disabled (strategy missing)");
}

 //  LINKEDIN OAUTH ROUTES
if (isProviderEnabled("linkedin")) {

  router.get(
    "/auth/linkedin",
    passport.authenticate("linkedin")
  );

  router.get(
    "/auth/linkedin/callback",
    passport.authenticate("linkedin", { failureRedirect: "/auth/failure" }),
    (req, res) => redirectSuccess(req, res, "linkedin")
  );

} else {
  console.warn("[AUTH ROUTES] LinkedIn auth disabled (strategy missing)");
}

 //  FACEBOOK OAUTH ROUTES
if (isProviderEnabled("facebook")) {

  router.get(
    "/auth/facebook",
    passport.authenticate("facebook", { scope: ["email"] })
  );

  router.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", { failureRedirect: "/auth/failure" }),
    (req, res) => redirectSuccess(req, res, "facebook")
  );

} else {
  console.warn("[AUTH ROUTES] Facebook auth disabled (strategy missing)");
}

 //  UNIFIED FAILURE HANDLING
router.get("/auth/failure", (req, res) => {

  console.error("[AUTH FAILURE]", {  
    query: req.query,
    path: req.path
  });

  return res.redirect(
    `${FRONTEND_URL}/authHubPage?status=failure&reason=oauth_failed`
  );
});

 //  LEGACY SUCCESS ROUTE
router.get("/auth/success", (req, res) => {
  return res.redirect(`${FRONTEND_URL}/authHubPage?status=success`);
});

module.exports = router;