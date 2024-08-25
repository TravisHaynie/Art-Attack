const router = require('express').Router();
const { User, Subject, GameSession } = require('../models'); 
// const { Op } = require('sequelize');

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

// Render canvas page
router.get('/canvas', (req, res) => {
    const sessionId = req.query.sessionId;
    res.render('canvas', {
        loggedIn: req.session.loggedIn,
        siteTitle: 'Canvas Drawing',
        sessionId: sessionId 
    });
});

// Render vote screen page
router.get('/votescreen', (req, res) => {
    const sessionId = req.query.sessionId;
    res.render('votescreen', {
        loggedIn: req.session.loggedIn,
        siteTitle: 'Vote Screen',
        sessionId: sessionId 
    });
});

// Render lobby page
router.get('/lobby', async (req, res) => {
    try {
        const sessionId = req.query.sessionId;

        const gameSession = await GameSession.findByPk(sessionId);
        if (!gameSession) {
            return res.status(404).json({ message: 'Game session not found.' });
        }

        // Redirect both players to the canvas page if both are assigned
        if (gameSession.player1 && gameSession.player2) {
            return res.redirect(`/canvas?sessionId=${gameSession.id}`);
        } else {
            // Ensure the current user is either player1 or player2
            const currentUser = req.session.user.id;
            if (currentUser === gameSession.player1 || currentUser === gameSession.player2) {
                res.render('lobby', { title: 'Lobby', user: req.session.user, gameSession });
            } else {
                return res.status(403).json({ message: 'You are not assigned to this game session.' });
            }
        }
    } catch (error) {
        console.error('Error fetching game session:', error);
        res.status(500).json({ message: 'An error occurred while fetching the game session.' });
    }
});

// Create or join a game session
router.post('/game-session', async (req, res) => {
    if (!req.session.loggedIn) {
        return res.status(401).json({ message: 'You must be logged in to create or join a game session.' });
    }
    console.log('Session LoggedIn:', req.session.loggedIn);
    console.log('Session User:', req.session.user);
    
    try {
        let session;
        const existingSession = await GameSession.findOne({
            where: { player2: null, inProgress: false }
        });

        if (existingSession) {
            console.log('Joining existing session:', existingSession.id);
            await existingSession.update({ player2: req.session.user.id });
            session = existingSession;
        } else {
            // Create a new game session
            const totalSubjects = await Subject.count();
            const randomSubjectId = Math.floor(Math.random() * totalSubjects) + 1;
            const subject = await Subject.findByPk(randomSubjectId);

            session = await GameSession.create({
                player1: req.session.user.id,
                player2: null,
                subject: subject.id,
                inProgress: false,
                votingEnabled: false,
                hasVoted: null,
            });

            console.log('Created new session:', session.id);
        }

        if (session.player1 && session.player2) {
            // Redirect both players to the canvas page if both are now assigned
            return res.status(200).json({ sessionId: session.id, redirectTo: `/canvas?sessionId=${session.id}` });
        } else {
            // If only one player is in the session, wait for the second player
            return res.status(200).json({ sessionId: session.id, message: 'Waiting for the other player to join...' });
        }

    } catch (error) {
        console.error('Error creating or joining game session:', error.message);
        res.status(500).json({ message: 'An error occurred while creating or joining the game session.' });
    }
});

// Fetch user info
router.get('/user-info', async (req, res) => {
    try {
        if (!req.session.user.id) {
            return res.status(401).json({ message: 'User not logged in' });
        }

        const userId = req.session.user.id;
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

// Fetch game session details
router.get('/game-session/:sessionId', async (req, res) => {
    try {
        const sessionId = req.params.sessionId;
        const gameSession = await GameSession.findByPk(sessionId);

        if (!gameSession) {
            return res.status(404).json({ message: 'Game session not found' });
        }

        res.status(200).json(gameSession);
    } catch (error) {
        console.error('Error fetching game session:', error);
        res.status(500).json({ message: 'An error occurred while fetching the game session' });
    }
});

// Get all subjects
router.get('/getAllSubjects', async (req, res) => {
    try {
        const allSubjects = await Subject.findAll();
        res.status(200).json(allSubjects);
    } catch (error) {
        console.error('Error getting all subjects:', error);
        res.status(500).json({ message: `An error occurred while getting all subjects: ${error.message}` });
    }
});

// Submit a subject suggestion
router.post('/suggestSubject', async (req, res) => {
    const { subject, submittedBy } = req.body;

    if (!subject || !submittedBy) {
        return res.status(400).json({ message: 'Subject and user ID are required.' });
    }

    try {
        const newSuggestion = await Subject.create({ subject, submittedBy });
        res.status(200).json({ message: 'Subject suggestion submitted successfully!' });
    } catch (error) {
        console.error('Error suggesting subject:', error);
        res.status(500).json({ message: `An error occurred while suggesting the subject: ${error.message}` });
    }
});

// Session cleansing (for development/testing purposes)
router.delete('/delete-sessions', async (req, res) => {
    try {
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
        await Subject.destroy({
            truncate: true,
            restartIdentity: true,
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
        await User.destroy({
            where: {},
            truncate: true,
            restartIdentity: true,
            cascade: true,
        });

        res.status(200).json({ message: 'All users have been deleted.' });
    } catch (error) {
        console.error('Error deleting all users:', error.message);
        res.status(500).json({ message: 'An error occurred while deleting all users.' });
    }
});

module.exports = router;
