// NOTE: Routes defined with express Router
const express = require('express');
const router = express.Router();

// authentication middleware
router.use((req, res, next) => {
  if(!req.isAuthenticated()){
    return res.redirect('/login')
  }
  next()
})

// dashboard
router.get('/dashboard', (req, res) => res.render('dashboard', {}));


module.exports = router;
