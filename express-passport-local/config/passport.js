// NOTE: Passport configuration
const passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      User = require('./../app/models');

// sessions configuration
passport.serializeUser((user, next) => next(null, user.id));
passport.deserializeUser((id, next) =>
    User.findById(id, (err, user) => next(err, user)));

// request authentication strategy configuration
// login
passport.use('login', new LocalStrategy({ passReqToCallback: true }, (req, username, password, next) => {
    User.findOne({ username: username }, ( err, user ) => {
        if(err){
          return next(err)
        }

        if(!user){
          return next(null, false)
        }

        if(!user.validPassword(password)){
          return next(null, false)
        }

        return next(null, user)
      });
    })
  );

// register
passport.use('register', new LocalStrategy({ passReqToCallback: true }, (req, username, password, next) => {
    User.findOne({ username: username }, ( err, user ) => {
        if(err){
          return next(err)
        }

        if(user){
          return next(null, false)
        }

        let newUser = new User();
            newUser.username = username;
            newUser.email = req.body.email
            newUser.password = newUser.encrypt(password);
            newUser.save((err) => {
              if(err){
                throw err;
              }
              return done(null, newUser)
            })
      });
    })
  );

module.exports = passport;
