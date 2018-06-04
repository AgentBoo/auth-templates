// NOTE: Passport configuration
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./../app/models');

// sessions configuration
passport.serializeUser((id, next) => next(null, id));
passport.deserializeUser((id, next) =>
    User.findById(id, (err, user) => next(err, user.id)));

// request authentication strategy configuration
// login
passport.use('login', new LocalStrategy({ passReqToCallback: true },
  function(req, username, password, next){
      User.findOne({ username: username }, ( err, user ) => {
          if(err){
            return next(err)
          }

          if(!user){
            return next(null, false, req.flash('loginError', 'Incorrect username'))
          }

          user.verify(password, (result) => {
            if(result instanceof Error){
              return next(null, false, req.flash('loginError', 'Something went wrong'))
            }

            if(result){
              return next(null, user.id)
            }

            return next(null, false, req.flash('loginError', 'Incorrect password'))
          })
        });
      })
  );

// register
passport.use('register', new LocalStrategy({ passReqToCallback: true },
  function(req, username, password, next){
      User.findOne({ username: username }, ( err, user ) => {
          if(err){
            return next(err)
          }

          if(user){
            return next(null, false, req.flash('registerError', 'User already exists'))
          }

          let newUser = new User();
              newUser.username = username;
              newUser.email = req.body.email
              newUser.password = password;
              newUser.save((err) => {
                if(err){
                  throw err;
                }
                return next(null, newUser.id, req.flash('registerSuccess', 'You have registered successfully'))
              })
        });
      })
  );

module.exports = passport;
