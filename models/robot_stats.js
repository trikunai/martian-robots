const Sequelize = require('sequelize');
const { sequelize } = require('./../lib/database');

const Robot = require('./robot');

const RobotStats = sequelize.define('robot_stats', {
    id: {
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
    },
    r: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
    },
    l: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
    },
    f: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
    },
}, {
    tableName: 'Robot_stats',
    timestamps: true,
});

Robot.hasOne(RobotStats, {
    foreignKey: 'idRobot',
});

RobotStats.belongsTo(Robot, {
    foreignKey: 'idRobot',
});

module.exports = RobotStats;

