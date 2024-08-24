const router = require('express').Router();
const { User, Subject, GameSession } = require('../models'); 

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

router.get('/lobby', (req, res) => {
  res.render('lobby', { title: 'Lobby', user: req.user });
});


router.post('/game-session', async (req, res) => {
  if (!req.session.loggedIn) {
    return res.status(401).json({ message: 'You must be logged in to create a game session.' });
  }
 console.log('Session LoggedIn:', req.session.loggedIn);
  try {
    // Check if there's an existing session where player2 is not yet assigned
    const existingSession = await GameSession.findOne({
      where: { player2: null, inProgress: false }
    });

    if (existingSession) {
      // Join the existing session
      return res.status(200).json({ sessionId: existingSession.id });
    }

    // Create a new session if no existing session is available
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

  console.log('Session User:', req.session.user);

    res.status(201).json({ sessionId: newGameSession.id });
  } catch (error) {
    console.error('Error creating or joining game session:', error.message);
    res.status(500).json({ message: 'An error occurred while creating or joining the game session.' });
  }
});



// Join a game session
// Backend route to handle session joining
router.post('/join-session', async (req, res) => {
  const { sessionId, userId } = req.body;

  if (!sessionId || !userId) {
      return res.status(400).json({ message: 'Session ID and user ID are required.' });
  }

  try {
    const session = await GameSession.findByPk(sessionId);
    if (!session) {
        return res.status(404).json({ message: 'Game session not found.' });
    }

    if (session.player2) {
        return res.status(400).json({ message: 'Game session is already full.' });
    }
    session.player2 = userId;

    // Check if both players are in the session before starting the game
    if (session.player1 && session.player2) {
      session.inProgress = true; // Set session as in progress
    }

    await session.save();

    res.status(200).json({ message: 'Joined game session successfully!', sessionId });
  } catch (error) {
    console.error('Error joining game session:', error);
    res.status(500).json({ message: 'An error occurred while joining the game session.' });
  }
});


// Get game session details
router.get('/game-session/:id', async (req, res) => {
  try {
    const gameSession = await GameSession.findByPk(req.params.id);
    if (!gameSession) {
      return res.status(404).json({ message: 'Game session not found.' });
    }

    res.status(200).json(gameSession);
  } catch (error) {
    console.error('Error fetching game session:', error);
    res.status(500).json({ message: 'An error occurred while fetching the game session.' });
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



module.exports = router;