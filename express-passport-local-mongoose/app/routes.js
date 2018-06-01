// NOTE: Routes defined with express Router
const express = require('express');
const router = express.Router();

// routes and middleware specific to this router
// If authentication succeeds, the next handler will be invoked and the req.user property will be set to the authenticated user.
router.get('/', (req, res) => res.render('index'));

router.get('/login', (req, res) => res.render('login', {
  message: req.flash('loginError')
}));
router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true,
}))

router.get('/register', (req, res) => res.render('register', {
  message: req.flash('signupError')
}));
router.post('/register', passport.authenticate('register', {
  successRedirect: '/dashboard',
  failureRedirect: '/register',
  failureFlash: true
}));

// protected path
router.get('/dashboard', (req, res) => {
  if(req.isAuthenticated()){
    return res.render('dashboard', { user: req.user })
  }

  res.redirect('/')
}
)

router.get('/logout', (req, res) => {
  // req.logout() passport function
  req.logout();
  res.redirect('/');
};

module.exports = router;

// the credentials used to authenticate a user will only be transmitted during the login request. If authentication succeeds, a session will be established and maintained via a cookie set in the user's browser.

// // routes
// app.get('/', (req, res) => res.render('index'));
// app.get('/register', (req, res) => res.render('register'));
// app.post('/register', (req, res) => {
//   let hash = bcrypt.hashSync(req.body.password, 14)
//   req.body.password = hash
//
//   let user = new User(req.body)
//
//   user.save((err) => {
//     if(err){
//       let error = 'Something bad happened! Please try again'
//
//       if(err.code === 11000){
//         error = 'The email is already taken, please try another'
//       }
//
//       return res.render('register', { error: error })
//     }
//
//     res.redirect('/dashboard')
//   })
// });
// app.get('/login', (req, res) => res.render('login'));
// app.post('/login', (req, res) => {
//   User.findOne({ email: req.body.email}, (err, user) => {
//     if(err || !user || !bcrypt.compareSync(req.body.password,user.password)){
//       return res.render('login', {
//         error: 'Incorrect email/password'
//       })
//     }
//     req.session.userId = user._id
//     res.redirect('/dashboard')
//   })
// })
// app.get('/dashboard', (req, res) => {
//   if(!req.session && req.session.userId){
//     return res.redirect('/login')
//   }
//   User.findById(req.session.userId, (err, user) => {
//     if(err){
//       return next(err)
//     }
//
//     if(!user){
//       return res.redirect('/login')
//     }
//   }
// )
//   res.render('dashboard')});
