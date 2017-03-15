/**
 * module dependencies for passport configuration
 */
const GitHubStrategy = require('passport-github').Strategy;

const GITHUB_CLIENT_ID = require('../config/credentials').GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = require('../config/credentials').GITHUB_CLIENT_SECRET;
const GITHUB_CALLBACK_URL = require('../config/credentials').GITHUB_CALLBACK_URL;

// controllers
const getUser = require('./entities/user/controller').getUser;
const signInViaGithub = require('./entities/user/controller').signInViaGithub;

/**
 * passport configuration
 */
const passportConfig = (app, passport) => {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    getUser(id).then(
      (user) => { done(null, user); },
      (error) => { done(error); }
    );
  });

  // github strategy for passport using OAuth
  passport.use(new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: GITHUB_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, cb) => {
      signInViaGithub(profile._json).then(
        (user) => { return cb(null, user); },
        (error) => { return cb(error); }
      );
    }
  ));
};

module.exports = passportConfig;
