const router = require('express').Router();
const { User } = require('../models'); 

// Render homepage
router.get('/', (req, res) => {
    res.render('home_menu', {
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

router.get('/canvas', (req, res) => {
    res.render('canvas', {
      loggedIn: req.session.loggedIn,
      siteTitle: 'Canvas Drawing'
    });
  });
  
  router.get('/votescreen', (req, res) => {
    res.render('votescreen', {
        loggedIn: req.session.loggedIn,
        siteTitle: 'Vote Screen'
    });
});

module.exports = router;
