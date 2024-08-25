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
    foreignKey: 'player1',
    onDelete: 'SET NULL',
});

GameSession.belongsTo(User, {
    foreignKey: 'player2',
    onDelete: 'SET NULL',
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