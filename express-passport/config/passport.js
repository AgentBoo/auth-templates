// NOTE: Passport configuration
const passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      User = require('./../app/models');

// sessions configuration
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// request authentication strategy configuration
passport.use(new LocalStrategy(User.authenticate()));

module.exports = passport;
