const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Subject extends Model {}

Subject.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        submittedBy: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id',
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        modelName: 'subject',
    }
);

module.exports = Subject;