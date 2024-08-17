const router = require('express').Router();
const { User } = require('../models'); // Import your models
const bcrypt = require('bcrypt'); // For password hashing

// Login route for Player 1
router.post('/login-player1', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username, playerType: 'player1' } });

    if (user && bcrypt.compareSync(password, user.passwordHash)) {
      req.session.loggedIn = true;
      req.session.playerType = 'player1'; // Track player type
      res.status(200).json(user);
    } else {
      res.status(400).json({ message: 'Invalid username or password for Player 1' });
    }
  } catch (error) {
    console.error('Error logging in Player 1:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login route for Player 2
router.post('/login-player2', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username, playerType: 'player2' } });

    if (user && bcrypt.compareSync(password, user.passwordHash)) {
      req.session.loggedIn = true;
      req.session.playerType = 'player2'; 
      res.status(200).json(user);
    } else {
      res.status(400).json({ message: 'Invalid username or password for Player 2' });
    }
  } catch (error) {
    console.error('Error logging in Player 2:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  try {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
