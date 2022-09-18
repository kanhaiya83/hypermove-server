const passport = require("passport");
const { Strategy } = require("passport-steam");
const {UserModel} = require("./database");

require("dotenv").config()
const strategyOptions = {
  returnURL: `${process.env.BASE_URL}/auth/steam/return`,
  realm: `${process.env.BASE_URL}/`,
  apiKey: process.env.STEAM_API_KEY,
};

module.exports = app => {
  passport.use(
    new Strategy(strategyOptions, async (identifier, profile, done) => {

      profile.identifier = identifier;

     const user= profile._json

      return done(null, user);
    }),
  );

  app.use(passport.initialize());
};