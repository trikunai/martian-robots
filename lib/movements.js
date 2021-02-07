const maxGridX = process.env.GRID_MAX_X || 50;
const maxGridY = process.env.GRID_MAX_Y || 50;
const maxGrid = [maxGridX,maxGridY];
const Utils = require('./../lib/utils');

let scentPositions = {};
const movements = {
    /**
     * Execute a move order
     * @param {number[]} coordinate coordinates | [1,1]
     * @param {string} orientation actual orientation of the robot | L
     * @param {string} order move order to execute | R
     * @returns {Object} result object with coordinates orientation and move
    */
    move: async (coordinates, orientation, order, grid, persistData = false) => {
        try {
            switch (order.toUpperCase()) {
                case 'L':
                    return { coordinates, orientation: await movements.rotate(orientation, 'L'), move: 'L'};
                case 'R':
                    return { coordinates, orientation: await movements.rotate(orientation, 'R'), move: 'R'};
                case 'F':
                    return await movements.moveForward(orientation, coordinates, grid, persistData);
                default:
                    throw new Error("Not a valid order found (existing accepted orders are 'R', 'L', 'F')")
              }
        } catch (error) {
            throw error;
        }
    },

    /**
     * Rotate from a previous orientation
     * @param {string} orientation actual orientation of the robot | L
     * @param {string} order move order to execute | R
     * @returns {string} next orientation
    */
    rotate: async (orientation, order) => {
        try {
            const nextOrientation = {
                'R': { N: 'E', E: 'S', S: 'W', W: 'N' },
                'L': { N: 'W', W: 'S', S: 'E', E: 'N'}
            }
            if (nextOrientation.hasOwnProperty(order) && nextOrientation[order].hasOwnProperty(orientation)) {
                return nextOrientation[order][orientation];
            } else {
                throw new Error('Not a valid rotate order')
            }
        } catch (error) {
            throw error;
        }
    },

    /**
     * Move forward from a previous orientation and orientation
     * @param {string} orientation actual orientation of the robot | L
     * @param {number[]} coordinates coordinates | [1,1]
     * @param {number[]} grid coordinates | [5,3]
     * @param {boolean} persistData if the data will be stored and persisted into a db
     * @returns {Object} result object with coordinates orientation and move
    */
    moveForward: async (orientation, coordinates, grid, persistData = false) => {
        try {
            const bc = [...coordinates]
            const bo = orientation;
            let beforePosition = {"coordinates": bc, "orientation": bo};
            switch (orientation) {
                case 'N':
                    // y++
                    coordinates[1]++;
                    break;
                case 'S':
                    // y--
                    coordinates[1]--;
                    break;
                case 'E':
                    // x++
                    coordinates[0]++;
                    break;
                case 'W':
                    // x--
                    coordinates[0]--;
                    break;
                default:
                    throw new Error(`"${orientation}" is not a valid orientation`)
            }

            let outsideGrid = await movements.checkOutsideGrid(grid, coordinates)
            if (outsideGrid) {
                beforePosition;
                if (await movements.isScentPosition(grid, bc, bo, persistData)) {
                    // As there is an existing escent signal, avoid movement and return original
                    return beforePosition;
                } else {
                    // lost
                    // push
                    if (persistData) {
                        await Utils.saveScent(grid, bc[0], bc[1], bo);
                    }

                    await movements.pushScentPosition(grid, bc, bo);
                    // save scent position
                    beforePosition.lost = true;
                    beforePosition.move = 'F'
                    return beforePosition;
                }
            } else {
                return {coordinates, orientation, move: 'F'};
            }
        } catch (error) {
            throw error;
        }
    },

    /**
     * Checks if coordinates are inside or outside the given grid
     * @param {number[]} grid coordinates | [5,3]
     * @param {number[]} coordinates coordinates | [1,1]
     * @returns {boolean} true = outside, false = inside
    */
    checkOutsideGrid: async (grid, coordinates) => {
        try {
            const leftCorner = [0,0];
            if (coordinates[0] >  grid[0]
                || coordinates[1] > grid[1]
                || coordinates[0] < leftCorner[0]
                || coordinates[1] < leftCorner[1]
            ) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            throw error;
        }
    },

    /**
     * If the actual coordinate and position could a scent from a previous lost robot
     * @param {number[]} grid coordinates | [5,3]
     * @param {number[]} coordinates coordinates | [1,1]
     * @param {string} orientation actual orientation of the robot | L
     * @param {boolean} persistData if the data will be stored and persisted into a db
     * @returns {boolean} true = scent,
    */
    isScentPosition: async (grid, coordinates, orientation, persistData = false) => {
        try {
            if (persistData) {
                // checking against the database persisted data
                if (await Utils.getGridScent(grid, coordinates, orientation)) {
                    return true;
                } else {
                    return false;
                }
            } else {
                // checking the js api object -without persistance- on api restart reset
                if (!scentPositions.hasOwnProperty(grid.toString())) {
                    return false
                } else {
                    const found = scentPositions[grid.toString()].find((s) => {
                        return s.orientation == orientation && s.coordinates[0] == coordinates[0] && s.coordinates[1] == coordinates[1];
                    })
                    return found ? true : false;
                }
            }
        } catch (error) {
            throw error;
        }
    },

    /**
     * Encondes a coordinates orientation and lost to a sstring representation
     * @param {number[]} coordinates coordinates | [1,1]
     * @param {string} orientation actual orientation of the robot | L
     * @param {boolean} lost if the robot is lost
     * @returns {string} converted string,
    */
    encodeOrderString: async (coordinates, orientation, lost=false) => {
        try {
            const x = coordinates[0];
            const y = coordinates[1];
            return `${x} ${y} ${orientation}${lost ? ' LOST': ''}`;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Decodes a string representation coordinates orientation to a js object
     * @param {string} string string representation of the coordinates and orientation
     * @returns {object} Converted data represented into a js object
    */
    decodeOrderString: async (string) => {
        try {
            const inputArray = string.trim().split(' ');
            return {
                coordinates: [parseInt(inputArray[0]), parseInt(inputArray[1])],
                orientation: inputArray[2].toString(),
            }
        } catch (error) {
            throw error;
        }
    },

    /**
     * Initial coordinates parser and validation
     * @param {string} string string representation of the coordinates and orientation
     * @param {boolean} persistData if the data will be stored and persisted into a db
     * @returns {number[]} coordinates coordinates | [1,1]
    */
    initialCoordinateParser: async (string, persistData = false) => {
        try {
            const c = string.trim().split(' ').map(n => parseInt(n));
            if (c.length > 2) {
                throw new Error('Not a valid inital coordinate, only 2D grid allowed')
            }

            const x = c[0];
            const y = c[1];

            if (isNaN(x)) {
                throw new Error(`Provided initial grid 'X' value is not a number`)
            }

            if (isNaN(y)) {
                throw new Error(`Provided initial grid 'Y' value is not a number`)
            }

            if (x > parseInt(maxGrid[0]) || y > parseInt(maxGrid[1])) {
                throw new Error(`Max grid dimensions "[${maxGrid.toString()}]" exceeded., only 2D grid allowed`)
            }

            if (persistData) {
                await Utils.saveGrid(x,y)
            }

            return [x,y];
        } catch (error) {
            throw error;
        }
    },

    /**
     * Push scent position into auxiliar array of scents
     * @param {number[]} grid coordinates | [5,3]
     * @param {number[]} coordinates coordinates | [1,1]
     * @param {string} orientation actual orientation of the robot | L
     * @returns {void}
    */
    pushScentPosition: async (grid, coordinates, orientation) => {
        try {
            if (!scentPositions.hasOwnProperty(grid.toString())) {
                scentPositions[grid.toString()] = [];
            }
            scentPositions[grid.toString()].push({coordinates, orientation})
        } catch (error) {
            throw error;
        }
    }
}


module.exports = movements;