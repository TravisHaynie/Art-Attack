const router = require('express').Router();
const { User, Subject, GameSession, Image } = require('../../models');

// render a lobby. once two sessions connect, count down until redirect

// render the game session and only allow player1 to see player1 page
// and player 2 to see player 2 page

// implement logic for game timer
// once timer runs out, redirect to the vote page

// votes will be rendered every 5 seconds
// users will give the link out so people can vote on the winner

//at the end of a timer, votes will be tallied and a winner will be decided

//NOTE: let's display a modal to show a winner on the vote page