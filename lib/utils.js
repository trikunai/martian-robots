const Sequelize = require('sequelize');
const { sequelize } = require('./../lib/database');
const Robot = require('./../models/robot');
const Scent = require('./../models/scent');
const Grid = require('./../models/grid');
const RobotStats = require('./../models/robot_stats');
const GridStats = require('./../models/grid_stats');
const logger = require('morgan');
const utils = {
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

    getRobot: async (idRobot) => {
        try {
            const robot = await Robot.findByPk(idRobot);

            return robot;
        } catch (error) {
            return error;
        }
    },

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

    getAllRobotsWithStats: async (id) => {
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