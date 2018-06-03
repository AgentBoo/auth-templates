// NOTE: Routes defined with express Router
const express = require('express');
const User = require('./models');
const router = express.Router();

// index
router.get('/', (req, res) => res.render('index', {}));


// register
router.get('/register', (req, res) => res.render('register', {}));
router.post('/register', (req, res) => {
  let newUser = new User();
  newUser.username = req.body.username;
  newUser.email = req.body.email;
  newUser.password = req.body.password;

  newUser.save((err) => {
    if(err) throw err
    res.redirect('/app/dashboard')
  })
});


// login
router.get('/login', (req, res) => res.render('login', {}));
router.post('/login', (req, res) => {
  User.findOne({ username: req.body.username }, (err, user) => {
    user.verify(req.body.password, (result) => {
      if(result instanceof Error){
        res.redirect('/login')
      }
      if(result){
        res.redirect('/app/dashboard')
      } else {
        res.redirect('/login')
      }
    })
  })
})

// dashboard
router.get('/app/dashboard', (req, res) => res.render('dashboard', {}))

module.exports = router;
