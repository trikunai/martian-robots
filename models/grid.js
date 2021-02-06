const Sequelize = require('sequelize');
const { sequelize } = require('./../lib/database');

const Grid = sequelize.define('grid', {
    idGrid: {
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
    },
    x: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
    },
    y: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
    },
}, {
    tableName: 'Grids',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['x', 'y'],
        },
    ],
});

module.exports = Grid;

