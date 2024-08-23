const router = require('express').Router();
const { User } = require('../models'); // Import your models
const bcrypt = require('bcrypt'); // For password hashing

// Login
router.post('/login', async (req, res) => {
  try {
    // Find the user by username
    const dbUserData = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    // Check if user exists
    if (!dbUserData) {
      return res.status(400).json({ message: 'Incorrect username or password. Please try again!' });
    }

    // Validate password
    const validPassword = await dbUserData.checkPassword(req.body.password);

    if (!validPassword) {
      return res.status(400).json({ message: 'Incorrect username or password. Please try again!' });
    }

    // Save session and respond with user data
    req.session.save(() => {
      req.session.loggedIn = true;
      req.session.user = {
        id: dbUserData.id,
        username: dbUserData.username,
        totalVotes: dbUserData.totalVotes,
        totalVictories: dbUserData.totalVictories
      };

      res.status(200).json({
        user: req.session.user, // Send user data
        message: 'You are now logged in!'
      });
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
      req.session.id = db.userData.id,

      res.status(200).json(dbUserData);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
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
