const User = require("./User");
const Subject = require("./Subject.js");
const GameSession = require("./GameSession.js");
const Image = require("./Image.js");

Subject.belongsTo(User, {
    foreignKey: 'submittedBy',
    onDelete: 'NO ACTION',
});

User.hasMany(Subject, {
    foreignKey: 'submittedBy',
    onDelete: 'NO ACTION',
});


GameSession.belongsTo(User, {
    as: 'Player1', // Aliases can help clarify which role the user is playing
    foreignKey: 'player1',
    onDelete: 'SET NULL', // Nullify player1 if the user is deleted
});

GameSession.belongsTo(User, {
    as: 'Player2', // Aliases can help clarify which role the user is playing
    foreignKey: 'player2',
    onDelete: 'SET NULL', // Nullify player2 if the user is deleted
});

// User.belongsTo(GameSession, {
//     foreignKey: 'id',
// });

GameSession.hasMany(Image, {
    foreignKey: 'sessionId', // Should match the field in Image model
    onDelete: 'CASCADE',
});

Image.belongsTo(GameSession, {
    foreignKey: 'sessionId', // Should match the field in Image model
});




module.exports = { User, Subject, GameSession, Image };