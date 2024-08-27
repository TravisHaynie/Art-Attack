const router = require('express').Router();
const { User, Subject, GameSession, Image } = require('../../models'); 
const { Op } = require('sequelize');

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
        const { sessionId, createdBy, imageBase64 } = req.body;
  
        if (!sessionId || !createdBy || !imageBase64) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
  
        // Save the Base64 image string to the database as JSON
        const newImage = await Image.create({
          sessionId: sessionId,
          createdBy: createdBy,
          imageData: imageBase64 // Save the Base64 string directly
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

  router.post('/vote', async (req, res) => {
    const { sessionId, votedFor } = req.body;
  
    try {
        // Find the image that corresponds to the voted player in the session
        const image = await Image.findOne({
            where: {
                sessionId: sessionId,
                createdBy: votedFor
            }
        });
  
        if (image) {
            // Increment the vote count for this image
            image.votes += 1;
            await image.save();
  
            res.status(200).json({ message: 'Vote recorded successfully.' });
        } else {
            res.status(404).json({ message: 'Image not found for the specified player.' });
        }
    } catch (error) {
        console.error('Error recording vote:', error);
        res.status(500).json({ message: 'An error occurred while recording the vote.' });
    }
  });

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
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