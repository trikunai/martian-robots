const Sequelize = require('sequelize');
const { sequelize } = require('./../lib/database');

const Grid = require('./grid');

const GridStats = sequelize.define('grid_stats', {
    id: {
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
    },
    totalForwardMovements: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
    },
    totalRightMovements: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
    },
    totalLeftMovements: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
    },
    totalLostRobots: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
    },
}, {
    tableName: 'Grid_stats',
    timestamps: true,
});

Grid.hasOne(GridStats, {
    foreignKey: 'idGrid',
});

GridStats.belongsTo(Grid, {
    foreignKey: 'idGrid',
});

module.exports = GridStats;

