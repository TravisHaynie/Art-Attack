const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
//
class GameSession extends Model {}

GameSession.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        users: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            allowNull: false,
            references: {
                model: 'user',
                key: 'id',
            }
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'subject',
                key: 'id',
            }
        },
        inProgress: {       // Determines if a game is in progress. if so, players can draw images. On false, save images to db.
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        votingEnabled: {    // Redirects players to voting page and generates a code/url to give voters. When time is up,
                            // no more votes are accepted, a winner is declared, and vote count and victory count are added to users.
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        hasVoted: {     // Keeps track of who has voted by user id. If a user's id is in this array, they have already voted.
            type: DataTypes.ARRAY(DataTypes.INTEGER),
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
    }
);

module.exports = GameSession;