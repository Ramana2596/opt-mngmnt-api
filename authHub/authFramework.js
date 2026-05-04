// File: authFramework.js
// Purpose: Central OAuth configuration (Google, Microsoft, LinkedIn, Facebook)

const passport = require("passport");

const GoogleStrategy = require("passport-google-oauth20").Strategy;
const MicrosoftStrategy = require("passport-azure-ad-oauth2").Strategy;
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

const sql = require("mssql");
const dbConfig = require("../dbConfig");

// USER UPSERT (FIXED FOR REAL TABLE STRUCTURE)
async function findOrCreateUser(profile, provider) {
  const pool = await sql.connect(dbConfig);

  const email =
    profile.emails?.[0]?.value ||
    profile._json?.email ||
    `${profile.id}@oauth.local`;

  const name =
    profile.displayName ||
    profile.username ||
    "Unknown User";

  const gameId = "OpsMgt"; 
  const assuranceLevel = 1;

  const result = await pool.request()
    .input("Email", sql.NVarChar, email)
    .input("Name", sql.NVarChar, name)
    .input("Provider", sql.NVarChar, provider)
    .input("GameId", sql.NVarChar, gameId)
    .input("AssuranceLevel", sql.Int, assuranceLevel)

    .query(`
      IF NOT EXISTS (
        SELECT 1 FROM User_Profile WHERE User_Email = @Email
      )
      BEGIN
        INSERT INTO User_Profile
        (
          Game_Id,
          User_Name,
          User_Email,
          Password,
          Assurance_Level,
          Created_On
        )
        VALUES
        (
          @GameId,
          @Name,
          @Email,
          NULL,
          @AssuranceLevel,
          GETDATE()
        )
      END

      SELECT * FROM User_Profile WHERE User_Email = @Email
    `);

  return result.recordset[0];
}

// FETCH USER BY ID (SESSION RESTORE)
async function findUserById(id) {
  const pool = await sql.connect(dbConfig);

  const result = await pool.request()
    .input("Id", sql.Int, id)
    .query(`
      SELECT * FROM User_Profile WHERE User_Id = @Id
    `);

  return result.recordset[0];
}

// GOOGLE OAUTH
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await findOrCreateUser(profile, "google");
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// MICROSOFT OAUTH
passport.use(new MicrosoftStrategy({
  clientID: process.env.MS_CLIENT_ID,
  clientSecret: process.env.MS_CLIENT_SECRET,
  callbackURL: "/auth/microsoft/callback"
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await findOrCreateUser(profile, "microsoft");
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// LINKEDIN OAUTH
passport.use(new LinkedInStrategy({
  clientID: process.env.LINKEDIN_CLIENT_ID,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  callbackURL: "/auth/linkedin/callback",
  scope: ["r_emailaddress", "r_liteprofile"]
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await findOrCreateUser(profile, "linkedin");
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

//FACEBOOK OAUTH
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: "/auth/facebook/callback",
  profileFields: ["id", "displayName", "emails"]
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await findOrCreateUser(profile, "facebook");
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// SESSION MANAGEMENT
passport.serializeUser((user, done) => {
  done(null, user.User_Id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUserById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;