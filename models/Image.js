const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Image extends Model {}

Image.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        imageData: {
            type: DataTypes.STRING,     // We are not sure yet, but it MIGHT be STRING
            allowNull: false,
        },
        sessionId: {
            type: DataTypes.INTEGER,    // References gameSession.id
            allowNull: false,
        },
        votes: {    // To be tallied when gameSession.votingEnabled is true for each user that clicks the vote button
                    // To be added to a player's vote count after voting has stopped and a winner is declared for a game session
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        freezeTableName: true,
        modelName: 'image',
    }
);

module.exports = Image;