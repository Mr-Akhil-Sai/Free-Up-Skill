const GoogleStrategy = require("passport-google-oauth20").Strategy;
const googleUser = require("../models/oAuthModel");

// getting google client id and secret
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        const newUser = {
          googleID: profile.id,
          displayName: profile.displayName,
          image: profile.photos[0].value,
        };
        try {
          let user = await googleUser.findOne({ googleID: profile.id });

          if (user) {
            done(null, user);
          } else {
            user = await googleUser.create(newUser);
            done(null, user);
          }
        } catch (error) {
          console.log(error);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    googleUser.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
