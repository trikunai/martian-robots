const Movements = require('../lib/movements');
const Utils = require('./../lib/utils');
const logger = require('morgan');

exports.getRobotStats = async (req, res) => {
    try {
        const result = await Utils.getAllRobotsWithStats();
        res.status(200).json(result);
    } catch (error) {
        logger(error);
        res.status(500).json(error.message);
    }
}

exports.getRobotStat = async (req, res) => {
    try {
        const result = await Utils.getRobotWithStats(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        logger(error);
        res.status(500).json(error.message);
    }
}

exports.getGridStats = async (req, res) => {
    try {
        const result = await Utils.getAllGridsWithStats();
        res.status(200).json(result);
    } catch (error) {
        logger(error);
        res.status(500).json(error.message);
    }
}

exports.getGridStat = async (req, res) => {
    try {
        const result = await Utils.getGridWithStats(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        logger(error);
        res.status(500).json(error.message);
    }
}