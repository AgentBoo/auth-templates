// NOTE: Passport configuration
const passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      User = require('./../app/models');

// sessions configuration
passport.serializeUser((user, next) => next(null, user.id));
passport.deserializeUser((id, next) =>
    User.findById(id, (err, user) => next(err, user));
);

// request authentication strategy configuration
passport.use(new LocalStrategy({ passReqToCallback: true }, (req, username, password, next) => {
    User.findOne({ username: username }, ( err, user ) => {
        if(err){
          return next(err)
        }

        if(!user){
          return next(null, false, req.flash('loginError', 'Incorrect username')
        }

        if(!user.validPassword(password)){
          return next(null, false, req.flash('loginError', 'Incorrect credentials'))
        }

        return next(null, user)
      });
    })
  );
};

module.exports = passport;
