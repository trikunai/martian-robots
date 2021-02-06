

const maxGridX = process.env.GRID_MAX_X || 50;
const maxGridY = process.env.GRID_MAX_Y || 50;
const maxGrid = [maxGridX,maxGridY];

let scentPositions = {};
const movements = {
    /**
     * Execute a move order
     * @param {number[]} coordinate coordinates | [1,1]
     * @param {string} orientation actual orientation of the robot | L
     * @param {string} order move order to execute | R
     * @returns
    */
    move: async (coordinates, orientation, order, grid) => {
        try {
            switch (order.toUpperCase()) {
                case 'L':
                    return { coordinates, orientation: await movements.rotate(orientation, 'L')};
                case 'R':
                    return { coordinates, orientation: await movements.rotate(orientation, 'R')};
                case 'F':
                    return await movements.moveForward(orientation, coordinates, grid);
                default:
                    throw new Error("Not a valid order (existing orders are 'R', 'L', 'F')")
              }
        } catch (error) {
            throw error;
        }
    },

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
            return error;
        }
    },

    moveForward: async (orientation, coordinates, grid) => {
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

            let outsideGride = await movements.checkOutsideGrid(grid, coordinates)
            if (outsideGride) {
                beforePosition;
                if (await movements.isScentPosition(grid, bc, bo)) {
                    // As there is an existing escent signal, avoid movement and return original
                    return beforePosition;
                } else {
                    // lost
                    // push
                    await movements.pushScentPosition(grid, bc, bo);
                    // save scent position
                    beforePosition.lost = true;
                    return beforePosition;
                }
            } else {
                return {coordinates, orientation};
            }
        } catch (error) {
            return error;
        }
    },

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
            return error;
        }
    },

    isScentPosition: async (grid, coordinates, orientation) => {
        try {
            if (!scentPositions.hasOwnProperty(grid.toString())) {
                return false
            } else {
                const found = scentPositions[grid.toString()].find((s) => {
                    return s.orientation == orientation && s.coordinates[0] == coordinates[0] && s.coordinates[1] == coordinates[1];
                })
                return found ? true : false;
            }
        } catch (error) {
            return error;
        }
    },

    encodeOrderString: async (coordinates, orientation, lost=false) => {
        try {
            const x = coordinates[0];
            const y = coordinates[1];
            return `${x} ${y} ${orientation} ${lost ? 'LOST': ''}`;
        } catch (error) {
            return error;
        }
    },

    decodeOrderString: async (string) => {
        try {
            const inputArray = string.trim().split(' ');
            return {
                coordinates: [parseInt(inputArray[0]), parseInt(inputArray[1])],
                orientation: inputArray[2].toString(),
            }
        } catch (error) {
            return error;
        }
    },

    initialCoordinateParser: async (string) => {
        try {
            const c = string.trim().split(' ').map(n => parseInt(n));
            if (c.length > 2) {
                throw new Error('Not a valid inital coordinate, only 2D grid allowed')
            }

            const x = c[0];
            const y = c[1];

            if (x > maxGrid[0] || y > maxGrid[1]) {
                throw new Error(`Max grid dimensions "[${maxGrid.toString()}]"exceeded., only 2D grid allowed`)
            }

            return [x,y];
        } catch (error) {
            return error;
        }
    },

    pushScentPosition: async (grid, coordinates, orientation) => {
        try {
            if (!scentPositions.hasOwnProperty(grid.toString())) {
                scentPositions[grid.toString()] = [];
            }
            scentPositions[grid.toString()].push({coordinates, orientation})
        } catch (error) {
            return error;
        }
    }
}


module.exports = movements;