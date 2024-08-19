const router = require('express').Router();
const { User } = require('../models'); 

// Render homepage
router.get('/', (req, res) => {
    res.render('main', {
      loggedIn: req.session.loggedIn,
      siteTitle: 'ART ATTACK'
    });
  });
  
// Render login page
router.get('/login', (req, res) => {
  res.render('login', {
    loggedIn: req.session.loggedIn 
  });
});

module.exports = router;
