const router = require('express').Router();
const { User, Subject, GameSession, Image } = require('../models'); 
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');