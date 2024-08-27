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
  