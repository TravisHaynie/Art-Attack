const router = require('express').Router();
const { User, Subject, GameSession } = require('../models'); 
const { Op } = require('sequelize');

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



router.post('/game-session', async (req, res) => {
  if (!req.session.loggedIn) {
    return res.status(401).json({ message: 'You must be logged in to create a game session.' });
  }

  console.log('Session LoggedIn:', req.session.loggedIn);
  console.log('Session User:', req.session.user);

  try {
    // Check for available game sessions
    const existingSession = await GameSession.findOne({
      where: { player2: null, inProgress: false }
    });

    if (existingSession) {
      // Join the existing session
      await existingSession.update({ player2: req.session.user.id });
      res.status(200).json({ sessionId: existingSession.id });
    } else {
      // Create a new game session
      const totalSubjects = await Subject.count();
      const randomSubjectId = Math.floor(Math.random() * totalSubjects) + 1;
      const subject = await Subject.findByPk(randomSubjectId);

      const newGameSession = await GameSession.create({
        player1: req.session.user.id,
        player2: null,
        subject: subject.id,
        inProgress: false,
        votingEnabled: false,
        hasVoted: null,
      });

      res.status(200).json({ sessionId: newGameSession.id });
    }
  } catch (error) {
    console.error('Error creating or joining game session:', error.message);
    res.status(500).json({ message: 'An error occurred while creating or joining the game session.' });
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

router.post('/suggestSubject', async (req, res) => {
  const { subject, submittedBy } = req.body;

  console.log('Received subject:', subject); // Debugging: Check what is received
  console.log('Submitted by user ID:', submittedBy); // Debugging: Check user ID

  // Basic validation
  if (!subject || !submittedBy) {
      return res.status(400).json({ message: 'Subject and user ID are required.' });
  }

  try {
      // Attempt to create the subject suggestion
      const newSuggestion = await Subject.create({ subject, submittedBy });
      res.status(200).json({ message: 'Subject suggestion submitted successfully!' });
  } catch (error) {
      // Detailed error logging
      console.error('Error suggesting subject:', error);
      res.status(500).json({ message: `An error occurred while suggesting the subject: ${error.message}` });
  }
});

router.post('/save-drawing', async (req, res) => {
  try {
      const { sessionId, playerId, drawing } = req.body;

      // Save the image data in the database
      const newImage = await Image.create({
          sessionId,
          playerId,
          imageData: drawing, // Assuming the Image model has a column 'imageData' to store base64 string
      });

      // Update the game session to mark it as ready for voting
      await GameSession.update({ inProgress: false, votingEnabled: true }, {
          where: { id: sessionId }
      });

      res.status(200).json({ message: 'Drawing saved successfully', imageId: newImage.id });
  } catch (err) {
      console.error('Error saving drawing:', err);
      res.status(500).json({ message: 'Server error' });
  }
});

router.get('/get-drawings', async (req, res) => {
  const { session } = req.query;

  try {
      const drawings = await Image.findAll({
          where: { sessionId: session },
          order: [['createdBy', 'ASC']], // Ensure the order is by player
      });

      res.json(drawings);
  } catch (error) {
      console.error('Error fetching drawings:', error);
      res.status(500).json({ message: 'Error fetching drawings.' });
  }
});


// VVV FOR SESSION CLEANSING ONLY, COMMENT OUT FOR PRODUCTION VVV

router.delete('/delete-sessions', async (req, res) => {
  try {
    // Delete all existing game sessions
    await GameSession.destroy({
      where: {},
      truncate: true,
      cascade: true,
    });

    res.status(200).json({ message: 'All game sessions have been deleted.' });
  } catch (error) {
    console.error('Error deleting game sessions:', error.message);
    res.status(500).json({ message: 'An error occurred while deleting game sessions.' });
  }
});

router.delete('/delete-all-subjects', async (req, res) => {
  try {
    // Truncate the Subject table to delete all subjects
    await Subject.destroy({
      truncate: true, // This option truncates the table
      restartIdentity: true, // This option restarts the auto-incrementing primary key counter
      cascade: true,
    });

    res.status(200).json({ message: 'All subjects have been deleted.' });
  } catch (error) {
    console.error('Error deleting all subjects:', error.message);
    res.status(500).json({ message: 'An error occurred while deleting all subjects.' });
  }
});

router.delete('/delete-all-users', async (req, res) => {
  try {
    // Delete all users from the User table
    await User.destroy({
      where: {}, // Specify an empty where clause to delete all records
      truncate: true, // This option truncates the table
      restartIdentity: true, // This option restarts the auto-incrementing primary key counter
      cascade: true,
    });

    res.status(200).json({ message: 'All users have been deleted.' });
  } catch (error) {
    console.error('Error deleting all users:', error.message);
    res.status(500).json({ message: 'An error occurred while deleting all users.' });
  }
});

// ^^^ FOR SESSION CLEANSING ONLY, COMMENT OUT FOR PRODUCTION ^^^



module.exports = router;