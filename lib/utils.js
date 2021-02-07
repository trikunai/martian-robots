const Sequelize = require('sequelize');
const { sequelize } = require('./../lib/database');
const Robot = require('./../models/robot');
const Scent = require('./../models/scent');
const Grid = require('./../models/grid');
const RobotStats = require('./../models/robot_stats');
const GridStats = require('./../models/grid_stats');
const logger = require('morgan');
const utils = {

    /**
     * Saves grid data and initializes gridStat data
     * @param {number} x X coordinate
     * @param {number} xy Y coordinate
     * @returns {void}
    */
    saveGrid: async (x, y) => {
        try {
            let grid = await Grid.findOne({
                where: {
                    x,
                    y
                }
            });

            if (grid) {
                logger("Grid already exists");

            } else {
                grid = await Grid.create({
                    x,
                    y
                });

                await GridStats.create({
                    totalForwardMovements: 0,
                    totalRightMovements: 0,
                    totalLeftMovements: 0,
                    totalLostRobots: 0,
                    idGrid: grid.idGrid,
                })
            }
        } catch (error) {
            throw error;
        }
    },

    /**
     * Saves robot related data into db
     * @param {number} x X coordinate
     * @param {number} y Y coordinate
     * @param {number[]} start_coordinates start coordinates | [1,1]
     * @param {string} start_orientation start orientation of the robot | L
     * @param {number[]} end_coordinates end coordinates | [1,1]
     * @param {string} end_orientation end orientation of the robot | L
     * @param {string[]} orders orders instructions received ["R", "L", "F"]
     * @returns {object} created robot object data
    */
    saveRobot: async (x, y, start_coordinates, start_orientation, end_coordinates, end_orientation, orders, lost) => {
        try {
            const grid = await Grid.findOne({
                where: {
                    x,
                    y
                }
            });

            if (!grid) {
                throw new Error("Grid does not exists");
            } else {
                const robot = await Robot.create({
                    idGrid: grid.idGrid,
                    start_coordinates,
                    start_orientation,
                    end_coordinates,
                    end_orientation,
                    orders,
                    lost
                });

                return robot;
            }
        } catch (error) {
            throw error;
        }
    },

    /**
     * Gets an existing robot from the db
     * @param {number} idRobot idRobot pk from database
     * @returns {object} created robot object data
    */
    getRobot: async (idRobot) => {
        try {
            const robot = await Robot.findByPk(idRobot);

            return robot;
        } catch (error) {
            return error;
        }
    },

    /**
     * Saves a scent position from the given data
     * @param {number[]} _grid grid data | [1,1]
     * @param {number} x X coordinate
     * @param {number} y Y coordinate
     * @param {string} orientation actual orientation of the robot | L
     * @returns {object} scent created object
    */
    saveScent: async (_grid, x, y, orientation) => {
        try {
            const grid = await Grid.findOne({
                where: {
                    x: _grid[0],
                    y: _grid[1]
                }
            });

            if (!grid) {
                throw new Error("Grid does not exists");
            } else {
                const scent = await Scent.create({
                    idGrid: grid.idGrid,
                    x,
                    y,
                    orientation,
                });

                return scent;
            }
        } catch (error) {
            throw error;
        }
    },

    /**
     * Gets an existing grid and includes its scents if exists
     * @param {number[]} g grid data | [1,1]
     * @returns {object} grid data object
    */
    getGridWithScents: async (g) => {
        try {
            const grid = await Grid.findOne({
                where: {
                    x: g[0],
                    y: g[1]
                },
                include: [
                    {
                        model: Scent,
                        as: "scents"
                    }
                ]
            });

            if (!grid) {
                throw new Error("Grid does not exists");
            } else {
                return grid;
            }
        } catch (error) {
            throw error;
        }
    },

    /**
     * Gets an existing finding it from a given scent coordinates ans orientation
     * @param {number[]} g grid data | [1,1]
     * @param {number[]} coordinates scent coordinates | [1,1]
     * @param {string} orientation scent orientation | L
     * @returns {object} grid data object
    */
    getGridScent: async (g, coordinates, orientation) => {
        try {
            const grid = await Grid.findOne({
                where: {
                    x: g[0],
                    y: g[1]
                },
                include: [
                    {
                        model: Scent,
                        as: "scents",
                        where: {
                            x: coordinates[0],
                            y: coordinates[1],
                            orientation
                        },
                        required: true,
                    },

                ],
                required: true
            });

            if (!grid) {
                return false
            } else {
                return grid;
            }
        } catch (error) {
            throw error;
        }
    },

    /**
     * Gets an existing grid and includes its scents ans stats if exists
     * @param {number} id grid pk from database
     * @returns {object} grid data object
    */
    getGridWithStats: async (id) => {
        try {
            const grid = await Grid.findByPk(id, {
                include: [
                    {
                        model: GridStats,
                    },
                    {
                        model: Scent,
                    },
                ]
            });

            if (!grid) {
                throw new Error("Grid does not exists");
            } else {
                return grid;
            }
        } catch (error) {
            throw error;
        }
    },

    /**
     * Gets all existing grids and includes stats and scent
     * @returns {object[]} array of grids data
    */
    getAllGridsWithStats: async () => {
        try {
            const grid = await Grid.findAll({
                include: [
                    {
                        model: GridStats,
                    },
                    {
                        model: Scent,
                    },
                ]
            });

            if (!grid) {
                throw new Error("Grid does not exists");
            } else {
                return grid;
            }
        } catch (error) {
            throw error;
        }
    },

    /**
     * Gets an existing robot and includes stats
     * @param {number} id ronot pk from database
     * @returns {object} robot data object
    */
    getRobotWithStats: async (id) => {
        try {
            const robot = await Robot.findByPk(id, {
                include: [
                    {
                        model: RobotStats,
                    }
                ]
            });

            if (!robot) {
                throw new Error("Robot does not exists");
            } else {
                return robot;
            }
        } catch (error) {
            throw error;
        }
    },

    /**
     * Gets all existing robots data and includes stats
     * @returns {object[]} array of robots data
    */
    getAllRobotsWithStats: async () => {
        try {
            const robot = await Robot.findAll({
                include: [
                    {
                        model: RobotStats,
                    }
                ]
            });

            if (!robot) {
                throw new Error("Robot does not exists");
            } else {
                return robot;
            }
        } catch (error) {
            throw error;
        }
    },


    /**
     * Saves stats data for an existing robot
     * @param {number} idRobot idRobot pk from database
     * @param {object} robotStats robots stats resume object
     * @returns {object[]} array of robots data
    */
    saveRobotStats: async (idRobot, robotStats) => {
        try {
            const robotStat = await RobotStats.create({
                idRobot,
                r: robotStats.R,
                l: robotStats.L,
                f: robotStats.F,
            });

            return robotStat;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Updates an existing grid stats stats data
     * @param {number} idGrid grid pk from database
     * @param {object} robotStats robots stats resume object
     * @param {boolean} lost if the robot is lost
     * @returns {object[]} array of robots data
    */
    updateGridStats: async (idGrid, robotStats, lost) => {
        try {
            let gridStat = await GridStats.findOne({
                where: {
                    idGrid
                }
            });

            gridStat = await GridStats.update(
                {
                    totalForwardMovements: gridStat.totalForwardMovements + robotStats.F,
                    totalRightMovements: gridStat.totalRightMovements + robotStats.R,
                    totalLeftMovements: gridStat.totalLeftMovements + robotStats.L,
                    totalLostRobots: gridStat.totalLostRobots + (lost ? 1 : 0),
                },
                {
                    where: {
                        idGrid: gridStat.idGrid,
                    }
                }
            );

            gridStat = await GridStats.findOne({
                where: {
                    idGrid,
                }
            });

            return gridStat;
        } catch (error) {
            throw error;
        }
    },
}


module.exports = utils;