// NOTE: Routes defined with express Router
const express = require('express'),
      passport = require('./../config/passport');
const User = require('./models');
const router = express.Router();

// index
router.get('/', (req, res) => res.render('index', {}));

// register
router.get('/register', (req, res) => res.render('register', { message: req.flash('registerError')} ));
router.post('/register', passport.authenticate('register', {
  successRedirect: '/dashboard',
  failureRedirect: '/register',
  failureFlash: true
})
);

// login
router.get('/login', (req, res) => res.render('login', { message: req.flash('loginError') }));
router.post('/login', passport.authenticate('login', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true
}));

// dashboard
router.get('/dashboard', (req, res) => res.render('dashboard', {}))

module.exports = router;
