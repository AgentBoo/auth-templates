// NOTE: Routes defined with express Router
const express = require('express'),
      passport = require('./../../config/passport');
const router = express.Router();

// index
router.get('/', (req, res) => res.render('index', {}));

// register
router.get('/register', (req, res) => res.render('register', { message: req.flash('registerError')} ));
router.post('/register', passport.authenticate('register', {
  successRedirect: '/app/dashboard',
  failureRedirect: '/register',
  failureFlash: true
})
);

// login
router.get('/login', (req, res) => res.render('login', { message: req.flash('loginError') }));
router.post('/login', passport.authenticate('login', {
  successRedirect: '/app/dashboard',
  failureRedirect: '/login',
  failureFlash: true
}));

// logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
