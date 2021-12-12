var passport = require("passport");

const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "778151593008-pcojhj7mc63e77bmh2c5m93fechqhplq.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "https://localhost/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);
