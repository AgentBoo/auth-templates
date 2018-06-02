// NOTE: Routes defined with express Router
const express = require('express');
const passport = require('./../config/passport');
const User = require('./models');
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
router.post('/register', (req, res) => {
  console.log(req.body)
  User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  }, (err, user) => {
    if(err){ console.error(err)}
    console.log(user)
  })
  User.find((error, users) => {console.log(users), res.redirect('/register')})
});

// protected path
router.get('/dashboard', (req, res) => {
  console.log(req)
  console.log(res.session)
  console.log(req.cookie)
  console.log(res.cookie)
  console.log(req.isAuthenticated())
  console.log(req.user)
  if(req.user){
    return res.render('dashboard', { user: req.user })
  }

  res.redirect('/')
}
)

router.get('/logout', (req, res) => {
  console.log(req)
  // res.cookie('user', '', { expires: new Date() })
  req.session.reset()
  // req.logout();
  res.redirect('/');
});

module.exports = router;
