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
        type: Sequelize.STRING(10),
        allowNull: false,
    },
    end_coordinates: {
        type: Sequelize.ARRAY(Sequelize.INTEGER(1)),
        allowNull: false,
    },
    end_orientation: {
        type: Sequelize.STRING(10),
        allowNull: false,
    },
    orders: {
        type: Sequelize.ARRAY(Sequelize.STRING(100)),
        allowNull: false,
    },
    lost: {
        type: Sequelize.BOOLEAN,
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

Scent.hasOne(Robot, {
    foreignKey: 'idScent',
    allowNull: true,
});

module.exports = Robot;

