const router = require('express').Router();
const homeRoutes = require('./homeRoutes');
const userRoutes = require('./userRoutes');

// Use routes
router.use('/', homeRoutes);
router.use('/api/users', userRoutes); // Adjust according to your API structure

module.exports = router;
