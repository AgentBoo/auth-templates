// NOTE: Routes defined with express Router
const express = require('express');
const passport = require('./../config/passport');
const router = express.Router();


// routes and middleware specific to this router
// If authentication succeeds, the next handler will be invoked and the req.user property will be set to the authenticated user.
router.get('/', (req, res) => res.render('index'));

router.get('/login', (req, res) => res.render('login'));
router.post('/login', passport.authenticate('login', {
  successRedirect: '/dashboard',
  failureRedirect: '/login'
}))

router.get('/register', (req, res) => res.render('register'));
// handle this using passport in order to immediately login after successful register
router.post('/register', passport.authenticate('register', {
  successRedirect: '/dashboard',
  failureRedirect: '/register'
}));

// protected path
router.get('/dashboard', passport.authenticate('login'), (req, res) => {
  if(req.user){
    return res.render('dashboard', { user: req.user })
  }

  res.redirect('/')
}
)

router.get('/logout', (req, res) => {
  // req.logout() passport function
  req.logout();
  res.redirect('/');
});

module.exports = router;
