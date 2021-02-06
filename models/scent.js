const Sequelize = require('sequelize');
const { sequelize } = require('./../lib/database');

const Grid = require('./grid');

const Scent = sequelize.define('scent', {
    idScent: {
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
    orientation: {
        type: Sequelize.INTEGER(1),
        allowNull: false,
    }
}, {
    tableName: 'Scents',
    timestamps: true,
});

Grid.hasMany(Scent, {
    foreignKey: 'idGrid',
});

Scent.belongsTo(Grid, {
    foreignKey: 'idGrid',
});

module.exports = Scent;

