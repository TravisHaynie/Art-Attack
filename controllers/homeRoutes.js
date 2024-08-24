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

  try {
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

    res.status(201).json({ sessionId: newGameSession.id });
  } catch (error) {
    console.error('Error creating game session:', error);
    res.status(500).json({ message: 'An error occurred while creating the game session.' });
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
      session.inProgress = true; // Set session as in progress
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

module.exports = router;