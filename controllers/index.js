const router = require('express').Router();
const homeRoutes = require('./homeRoutes');
const userRoutes = require('./userRoutes');
const gameController = require('./api');
// const gameSessionApi = require('./api/gameSessionRoutes')

// Use routes
router.use('/', homeRoutes);
router.use('/user', userRoutes);
router.use('/api', gameController);

module.exports = router;
