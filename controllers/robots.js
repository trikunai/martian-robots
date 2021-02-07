const Movements = require('../lib/movements');
const Utils = require('./../lib/utils');
const logger = require('morgan');
const maxOrdersPerRobot = process.env.MAX_ORDERS_PER_ROBOT || 100;

const execute = (req, persistData = false) => new Promise(async (resolve, reject) => {
    try {
        const instructions = req.body.instructions.split("\n");
        // validate grid
        const grid = await Movements.initialCoordinateParser(instructions[0]);
        // for starting from line 1 and 2 lines per step
        const robots = [];
        for (let index = 1; index < instructions.length; index += 2) {
            const element = instructions[index];
            if (instructions[index+1].trim().length > maxOrdersPerRobot) {
                throw new Error(`Max order/instruction per robot is set at ${maxOrdersPerRobot}. Total of ${instructions[index+1].trim().length} orders/instructions received.`)
            }
            robots.push({
                coordinates: [parseInt(element.trim().split(' ')[0]), parseInt(element.trim().split(' ')[1])],
                orientation: element.trim().split(' ')[2],
                orders: instructions[index+1].trim().split(''),
            })
        }
        let result = '';
        const robotStatsArray = [];
        let gridStat;
        for (const robot of robots) {
            const robotStartCoordinates = [...robot.coordinates];
            let newPosition;
            let robotStats = {
                R: 0, L: 0, F: 0
            }
            for (const order of robot.orders) {
                if (!newPosition) {
                    newPosition = robot;
                }

                newPosition = await Movements.move(newPosition.coordinates, newPosition.orientation, order, grid, persistData);

                // sum robot move at stats
                if (newPosition.move) {
                    robotStats[newPosition.move]++;
                }
                if (newPosition.lost) {
                    break;
                }
            }
            const lost = newPosition.lost ? true : false
            result = result + await Movements.encodeOrderString(newPosition.coordinates, newPosition.orientation, lost);

            if (persistData) {
                let savedRobot = await Utils.saveRobot(grid[0], grid[1], robotStartCoordinates, robot.orientation, newPosition.coordinates, newPosition.orientation, robot.orders, lost);

                // Save robot stats

                if (savedRobot) {
                    const robotStat = await Utils.saveRobotStats(savedRobot.idRobot, robotStats);
                    robotStatsArray.push(robotStat);
                    gridStat = await Utils.updateGridStats(savedRobot.idGrid, robotStats, lost);
                }
            }
            if (robot != robots[robots.length -1]) {
                result = result + "\n";
            }
        }
        resolve({output:result, gridStat, robotsStats: robotStatsArray});
    } catch (error) {
        reject(error);
    }
});

exports.postRobots = async (req, res) => {
    try {
        const result = await execute(req, true)
        res.status(200).json(result);
    } catch (error) {
        logger(error);
        res.status(500).json(error.message);
    }
}