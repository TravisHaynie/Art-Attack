const router = require('express').Router();
const { User } = require('../models'); // Import your models
const bcrypt = require('bcrypt'); // For password hashing

// Login
router.post('/login', async (req, res) => {
  try {
    const dbUserData = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!dbUserData) {
      res
        .status(400)
        .json({ message: 'Incorrect username or password. Please try again!' });
      return;
    }

    const validPassword = await dbUserData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect username or password. Please try again!' });
      return;
    }

    req.session.save(() => {
      req.session.loggedIn = true;

      res
        .status(200)
        .json({ user: dbUserData, message: 'You are now logged in!' });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
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

router.get('/user/:id', (req, res) => {
  console.log(req);
  User.findByPk(req.params.id)
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


// VVV FOR TESTING PURPOSES ONLY DO NOT RENDER VVV
router.get('/users', (req, res) => {
  // Assuming User model is imported and available
  User.findAll()
    .then((users) => {
      const userIds = users.map(user => user.id); // Extracting user IDs
      
      console.log('User IDs:', userIds); // Logging user IDs to the console
      res.send('User IDs logged to console.'); // Sending a response to the client
    })
    .catch((err) => {
      console.error('Error fetching users:', err);
      res.status(500).send('An error occurred while fetching users');
    });
});
// ^^^ FOR TESTING PURPOSES ONLY DO NOT RENDER ^^^

module.exports = router;
