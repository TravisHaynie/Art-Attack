const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
//
class GameSession extends Model { }

GameSession.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        player1: {
            type: DataTypes.INTEGER,       // References user.id
            allowNull: true,
            references: {
                model: 'user',
                key: 'id',
            },
        },
        player2: {
            type: DataTypes.INTEGER,       // References user.id
            allowNull: true,
            references: {
                model: 'user',
                key: 'id',
            },
        },
        subject: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'subject',
                key: 'id',
            }
        },
        inProgress: {       // Determines if a game is in progress. if so, players can draw images. On false, save images to db.
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        votingEnabled: {    // Redirects players to voting page and generates a code/url to give voters. When time is up,
            // no more votes are accepted, a winner is declared, and vote count and victory count are added to users.
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        hasVoted: {     // Keeps track of who has voted by user id. If a user's id is in this array, they have already voted.
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'user',
                key: 'id',
            }
        },
    },
    {
        sequelize,
        freezeTableName: true,
        modelName: 'gameSession',
        indexes: [
            {
                unique: false,
                fields: ['player1']
            },
            {
                unique: false,
                fields: ['player2']
            },
            {
                unique: false,
                fields: ['subject']
            }
        ]
    }
);

module.exports = GameSession;