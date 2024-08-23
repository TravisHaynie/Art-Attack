const router = require('express').Router();
const { User, GameSession } = require('../models'); 

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

router.post('/game-session', async (req, res) => {

  // Find the total count of subjects in the database
  const totalSubjects = await Subject.count();

  // Generate a random number between 1 and the total number of subjects
  const randomSubjectId = Math.floor(Math.random() * totalSubjects) + 1;

  // Find a subject based on the random subject ID
  const subject = await Subject.findByPk(randomSubjectId);

  try {
    const newGameSession = await GameSession.create({
      player1: req.user.id,
      player2,
      subject: subject.id,
      inProgress: false, // Set initially to false
      votingEnabled: false,
      hasVoted: null,
    });

    console.log(newGameSession);

    // Update the inProgress value to true just before redirecting
    newGameSession.inProgress = true;
    await newGameSession.save();

    const gameSessionData = await GameSession.findByPk(newGameSession.id);
    const gameSession = gameSessionData.get({ plain: true });
    
    res.redirect(`/game-session/${gameSession.id}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/game-session/:id', async (req, res) => {
  const gameSessionId = req.params.id;

  // Fetch the game session data based on the provided ID
  try {
    const gameSession = await GameSession.findByPk(gameSessionId);

    if (!gameSession) {
      return res.status(404).json({ error: 'Game session not found' });
    }

    // Render the game session details or return the data in JSON format
    res.json(gameSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

  // create game session

  //take game session id and redirect to game-session/:id



// game-session:id

//game-session:id:player1

//game-session:id:player2



module.exports = router;
