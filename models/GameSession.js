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
        users: {
            type: DataTypes.ARRAY,
            allowNull: false,
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        
    }
)