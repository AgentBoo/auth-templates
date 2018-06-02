// NOTE: Routes defined with express Router
const express = require('express'),
      passport = require('./../config/passport');
const User = require('./models');
const router = express.Router();

// index
router.get('/', (req, res) => res.render('index', {}));

// register
router.get('/register', (req, res) => res.render('register', {}));
router.post('/register', (req, res) => {
  const newUser = new User();
        newUser.name = req.body.name;
        newUser.email = req.body.email;
        newUser.password = req.body.password;
        newUser.save((err) => {
          if(err){
            throw err
          }
          res.redirect('/dashboard')
        })
});

// login
router.get('/login', (req, res) => res.render('login', {}));
router.post('/login', (req, res) => {
  User.findOne({ name: req.body.name}, (err, user) => {
    if(err){
      throw err
    }
    user.validPassword(req.body.password, (err, match) => {
      if(err){
        throw err
      }
      if(match){
        res.redirect('/dashboard')
      } else {
        res.redirect('/login')
      }
    })
  })
})

// dashboard
router.get('/dashboard', (req, res) => res.render('dashboard', {}))
module.exports = router;
