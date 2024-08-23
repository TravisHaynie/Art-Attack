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
  // Check if player1, player2, and subject are provided in the request body
  if (!req.body.player1 || !req.body.player2 || !req.body.subject) {
    return res.status(400).json({ error: 'player1, player2, and subject are required fields' });
  }

  // Find the total count of subjects in the database
  const totalSubjects = await Subject.count();

  // Generate a random number between 1 and the total number of subjects
  const randomSubjectId = Math.floor(Math.random() * totalSubjects) + 1;

  // Find a subject based on the random subject ID
  const subject = await Subject.findByPk(randomSubjectId);

  // Check if player1 and player2 are different users
  if (player1 === player2) {
    return res.status(400).json({ error: 'player1 and player2 must be different users' });
  }

  try {
    const newGameSession = await GameSession.create({
      player1: req.user.id,
      player2,
      subject: subject.id,
      inProgress: false,
      votingEnabled: false,
      hasVoted: null,
    });

    const gameSessionData = await GameSession.findByPk(newGameSession.id);
    const gameSession = gameSessionData.get({ plain: true });

    res.redirect(`/game-session/${gameSession.id}`);
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
