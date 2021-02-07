const Sequelize = require('sequelize');
const logger = require('morgan');
const databaseURL = process.env.DATABASE_URL || 'postgres';
const databasePort = process.env.DATABASE_PORT || 5432;
const user = process.env.DATABASE_USERNAME || 'root';
const password = process.env.DATABASE_PASSWORD || '1234';
const database = process.env.DATABASE || 'martianrobots';

// initializes db objetc using Sequelize
const sequelize = new Sequelize(database, user, password, {
    host: databaseURL,
    port: databasePort,
    operatorsAliases: false,
    dialect: 'postgres',
    logging: false,
    define: {
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
    },
    native: false,
});

const tables = [
    'grid',
    'grid_stats',
    'scent',
    'robot',
    'robot_stats',
];

// performs and db table alters from models file definitions
const updateDatabase = () => new Promise(async (resolve) => {
    for (const file of tables) {
        const model = require(`../models/${file}`);
        try {
            await model.sync({ alter: true });
            logger(`${model.tableName} table updated`);
        } catch (err) {
            logger(`${model.tableName} table NOT updated: ${err}`);
        }
    }
    resolve();
});

module.exports = {
    sequelize,
    updateDatabase,
};