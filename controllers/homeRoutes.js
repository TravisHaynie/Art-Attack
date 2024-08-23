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

router.post('/game-session', async (req, res) => {

  // Find the total count of subjects in the database
  const totalSubjects = await Subject.count();
  console.log(await Subject.findAll());

  // Generate a random number between 1 and the total number of subjects
  const randomSubjectId = Math.floor(Math.random() * totalSubjects) + 1;
  console.log(randomSubjectId);
  // Find a subject based on the random subject ID
  const subject = await Subject.findByPk(randomSubjectId);
  console.log(subject.id);

  try {
    const newGameSession = await GameSession.create({
      player1: req.session.id,
      player2: null,
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

router.get('/game-session', async (req, res) => {
  try {
    // Data to be sent in the POST request
    const postData = {
      player1: req.session.user,
    };
  
    req.body = postData; 
    req.method = 'POST'; 
    req.url = '/game-session'; 
    
    const response = {
      data: null,
      redirect: function (path) {
        res.redirect(path); // Redirect the user based on the response data
      },
      status: function (statusCode) {
        res.status(statusCode).json({ error: 'Internal server error' }); // Handle status codes
      }
    };

    // Call the route handler for the POST request
    await router.handle(req, response);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error A' });
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
