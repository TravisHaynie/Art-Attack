const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Subject extends Model {}

GameSession.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
    }
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'subject',
    }
);

module.exports = Subject;