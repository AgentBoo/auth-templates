// NOTE: Passport configuration
const passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      User = require('./../app/models');

// sessions configuration
passport.serializeUser((user, next) => next(null, user.id))
passport.deserializeUser((id, next) => User.findById(id, (err, user) => next(err, user)))

// request authentication strategy configuration
passport.use('login', new LocalStrategy({ passReqToCallback: true},
  function(req, username, password, next){
    User.findOne({ username: username}, (err, user) => {
      if(err){
        return next(err)
      }
      if(!user){
        return next(null, false, req.flash('loginError', 'Incorrect username'))
      }
      if(!user.validPassword(password)){
        return next(null, false, req.flash('loginError', 'Incorrect password'))
      }
      return next(null, user)
  })
}));

passport.use('register', new LocalStrategy({ passReqToCallback: true},
  function(req, username, password, next){
    User.findOne({ username: username }, (err, user) => {
      if(err){
        return next(err)
      }
      if(user){
        return next(null, false, req.flash('registerError', 'User already exists'))
      }

    const newUser = new User();
          newUser.username = req.body.username;
          newUser.email = req.body.email;
          newUser.password = req.body.password;
          newUser.save((err) => {
            if(err){
              throw err
            }
            return next(null, newUser)
          })

   })
  }
))

module.exports = passport;
