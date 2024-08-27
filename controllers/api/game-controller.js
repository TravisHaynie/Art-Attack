const router = require('express').Router();
const { User, Subject, GameSession, Image } = require('../models'); 
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');

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