const User = require("./User");
const Subject = require("./Subject.js");
const GameSession = require("./GameSession.js");
const Image = require("./Image.js");

Subject.belongsTo(User, {
    foreignKey: 'id',
});

User.hasMany(Subject, {
    foreignKey: 'id',
});

GameSession.hasOne(User, {
    foreignKey: 'player1',
});

GameSession.hasOne(User, {
    foreignKey: 'player2',
});

User.belongsTo(GameSession, {
    foreignKey: 'id',
});



module.exports = { User, Subject, GameSession, Image }; // All models listed in order of dependence
