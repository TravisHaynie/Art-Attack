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
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW, // Set default value to NOW()
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW, // Set default value to NOW()
        },
    },
    {
        sequelize,
        freezeTableName: true,
        modelName: 'subject',
    }
);

module.exports = Subject;