const express = require('express');
const router = express.Router();


const gameController = require('./game-controller');


router.use('/game-controller', gameController);

module.exports = router;