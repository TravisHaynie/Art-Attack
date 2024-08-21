const router = require('express').Router();
const homeRoutes = require('./homeRoutes');
const userRoutes = require('./userRoutes');

// Use routes
router.use('/', homeRoutes);
router.use('/user', userRoutes);

module.exports = router;
