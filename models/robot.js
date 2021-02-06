const Sequelize = require('sequelize');
const { sequelize } = require('./../lib/database');

const Grid = require('./grid');
const Scent = require('./scent');

const Robot = sequelize.define('robot', {
    idRobot: {
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
    },
    start_coordinates: {
        type: Sequelize.ARRAY(Sequelize.INTEGER(1)),
        allowNull: false,
    },
    start_orientation: {
        type: Sequelize.INTEGER(1),
        allowNull: false,
    },
    end_coordinates: {
        type: Sequelize.ARRAY(Sequelize.INTEGER(1)),
        allowNull: false,
    },
    end_orientation: {
        type: Sequelize.INTEGER(1),
        allowNull: false,
    }
}, {
    tableName: 'Robots',
    timestamps: true,
});

Robot.belongsTo(Grid, {
    foreignKey: 'idGrid',
});

Robot.belongsTo(Scent, {
    foreignKey: 'idScent',
    allowNull: true,
});

module.exports = Robot;

