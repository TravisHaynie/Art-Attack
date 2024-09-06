const router = require('express').Router();
const { User, GameSession } = require('../models'); // Import your models
const bcrypt = require('bcrypt'); // For password hashing

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const dbUserData = await User.findOne({ where: { username } });

    if (!dbUserData || !await dbUserData.checkPassword(password)) {
      return res.status(400).json({ message: 'Incorrect username or password. Please try again!' });
    }

    req.session.save(() => {
      req.session.loggedIn = true;
      req.session.user = {
        id: dbUserData.id,
        username: dbUserData.username,
        totalVotes: dbUserData.totalVotes,
        totalVictories: dbUserData.totalVictories,
      };

      res.status(200).json({ user: req.session.user, message: 'You are now logged in!' });
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'An error occurred during login.' });
  }
});


// CREATE new user
router.post('/', async (req, res) => {
  try {
    const dbUserData = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    req.session.save(() => {
      req.session.loggedIn = true;
      req.session.id = dbUserData.id,

        res.status(200).json(dbUserData);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});



// Logout route
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'An error occurred during logout.' });
    }
    res.status(204).end(); // No content to send back
  });
});

router.post('/user', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Create a new user
    const dbUserData = await User.create({
      username,
      email,
      password,
    });

    req.session.save(() => {
      req.session.loggedIn = true;
      req.session.user = {
        id: dbUserData.id,
        username: dbUserData.username,
        email: dbUserData.email,
        totalVotes: dbUserData.totalVotes,
        totalVictories: dbUserData.totalVictories,
      };

      res.status(200).json(dbUserData);
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'An error occurred during signup.' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.status(204).end(); // No content to send back
  });
});



router.get('/:username', (req, res) => {
  const username = req.params.username; // Get the username from the URL parameter

  User.findOne({ where: { username } })
    .then((userData) => {
      if (!userData) {
        return res.status(404).send('User not found');
      }

      res.render('user-profile', {
        username: userData.username,
        votes: userData.totalVotes,
        victories: userData.totalVictories,
      });
    })
    .catch((err) => {
      console.error('Error fetching user data:', err);
      res.status(500).send('An error occurred while fetching user data');
    });
});

module.exports = router;