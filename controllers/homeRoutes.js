const router = require('express').Router();
const { User, Subject, GameSession, Image } = require('../models'); 
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');


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
  const sessionId = req.query.sessionId;
  res.render('canvas', {
      loggedIn: req.session.loggedIn,
      siteTitle: 'Canvas Drawing',
      sessionId: sessionId 
  });
});

router.get('/votescreen', (req, res) => {
  const sessionId = req.query.sessionId;
  res.render('votescreen', {
      loggedIn: req.session.loggedIn,
      siteTitle: 'Vote Screen',
      sessionId: sessionId 
  });
});

router.get('/lobby', async (req, res) => {
  try {
    const sessionId = req.query.session;

    const gameSession = await GameSession.findByPk(sessionId);
    if (!gameSession) {
      return res.status(404).json({ message: 'Game session not found.' });
    }

    if (gameSession.player1 && gameSession.player2) {
      // Both players are assigned, redirect them to the canvas page
      return res.redirect(`/canvas?sessionId=${gameSession.id}`);
    } else {
      // Check if the current user is player1 or player2
      const currentUser = req.session.user.id; 

      if (currentUser === gameSession.player1 || currentUser === gameSession.player2) {
        // Render the lobby for the player
        res.render('lobby', { title: 'Lobby', user: req.user, gameSession });
      } else {
        // Player not assigned to the game session
        return res.status(403).json({ message: 'You are not assigned to this game session.' });
      }
    }
  } catch (error) {
    console.error('Error fetching game session:', error);
    res.status(500).json({ message: 'An error occurred while fetching the game session.' });
  }
});


router.get('/user-info', async (req, res) => {
  try {
    // Check if user is logged in
    if (!req.session.user.id) {
      return res.status(401).json({ message: 'User not logged in' });
    }

    // Retrieve the logged-in user's ID from the session
    const userId = req.session.user.id;

    // Fetch the user's information from the database
    const userData = await User.findByPk(userId, {
      attributes: { exclude: ['password'] } // Exclude password from the response
    });

    if (!userData) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(userData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/game-session/:sessionId', async (req, res) => {
  try {
    const sessionId = req.params.sessionId;

    // Fetch the game session from the database using the session ID
    const gameSession = await GameSession.findByPk(sessionId);

    if (!gameSession) {
      return res.status(404).json({ message: 'Game session not found' });
    }

    // Return the game session data in the response
    res.status(200).json(gameSession);
  } catch (error) {
    console.error('Error fetching game session:', error);
    res.status(500).json({ message: 'An error occurred while fetching the game session' });
  }
});


router.get('/getAllSubjects', async (req, res) => {
  try {
    // Retrieve all subject suggestions
    const allSubjects = await Subject.findAll();

    res.status(200).json(allSubjects);
  } catch (error) {
    console.error('Error getting all subjects:', error);
    res.status(500).json({ message: `An error occurred while getting all subjects: ${error.message}` });
  }
});

router.get('/get-images', async (req, res) => {
  try {
      const { sessionId } = req.query;

      // Fetch images based on the session ID
      const images = await Image.findAll({
          where: { sessionId: sessionId },
          attributes: ['createdBy', 'imageData', 'votes'] // Include vote counts
      });

      res.render('images', { player1_image: images[0].imageData, player2_image: images[1].imageData });
  } catch (error) {
      console.error('Error fetching images:', error);
      res.status(500).json({ error: 'An error occurred while fetching images' });
  }
});


// Route to serve images by ID
router.get('/image/:imageId', async (req, res) => {
  try {
      const imageId = req.params.imageId;
      const image = await Image.findByPk(imageId);

      if (!image) {
          return res.status(404).json({ message: 'Image not found' });
      }

      // Set the correct header for image type
      res.setHeader('Content-Type', 'image/png'); 
      const imgBuffer = Buffer.from(image.imageData.data, 'base64');
      res.send(imgBuffer);
  } catch (error) {
      console.error('Error fetching image:', error);
      res.status(500).json({ message: 'An error occurred while fetching the image' });
  }
});






module.exports = router;