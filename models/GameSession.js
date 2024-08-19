const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class GameSession extends Model {}

GameSession.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        users: {    // Foreign key is user.id
            type: DataTypes.ARRAY,
            allowNull: false,
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        inProgress: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        votingEnabled: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        hasVoted: {
            type: DataTypes.ARRAY,
            allowNull: true,
        },
    },
    {
        sequelize,
        freezeTableName: true,
        modelName: 'gameSession',
    }
);

module.exports = GameSession;