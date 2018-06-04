// NOTE: Routes defined with express Router
const express = require('express')
      passport = require('./../config/passport');
const router = express.Router();

// NOTE: Common routes
// index
router.get('/', (req, res) => res.render('index', { message: req.flash('logoutMessage') }));


// register
router.get('/register', (req, res) => res.render('register', { message: req.flash('registerError')}));
router.post('/register', passport.authenticate('register', {
  successRedirect: '/app/dashboard',
  successFlash: true,
  failureRedirect: '/register',
  failureFlash: true
}));


// login
router.get('/login', (req, res) => res.render('login', { message: req.flash('loginError')}));
router.post('/login', passport.authenticate('login', {
  successRedirect: '/app/dashboard',
  failureRedirect: '/login',
  failureFlash: true
}));


// logout
router.get('/logout', (req, res) => {
  // req.session.reset() is not enough -- use req.logout() provided by passport
  req.logout();
  req.flash('logoutMessage', 'You have been logged out successfully');
  res.redirect('/');
});


// NOTE: Protected routes
router.use('/app', (req, res, next) => {
  if(!req.isAuthenticated()){
    return res.redirect('/')
  }
  next()
});


// dashboard
router.get('/app/dashboard', (req, res) => {
  res.render('dashboard', { message: req.flash('registerSuccess') })
});


module.exports = router;
