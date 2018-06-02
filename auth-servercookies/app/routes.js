// NOTE: Routes defined with express Router
const express = require('express');
const passport = require('./../config/passport');
const User = require('./models');
const router = express.Router();

// index
router.get('/', (req, res) => res.render('index', {}));

// register
router.get('/register', (req, res, next) => res.render('register', {}))
router.post('/register', function(req, res){
  User.register(
    new User({ name: req.body.name, email: req.body.email}),
    req.body.password,
    (err) => {
      if(err){
        return next(err)
      };
      res.redirect('/')
    });
});

// login
router.get('/login', (req, res) => res.render('login', {}));
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

// logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/')
});

module.exports = router;
