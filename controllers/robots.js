const Movements = require('../lib/movements');
const database = require('./../lib/database');
exports.postRobots = async (req, res) => {
    try {
        // validate
        database;
        const instructions = req.body.instructions.split("\n");
        // validate grid
        const grid = await Movements.initialCoordinateParser(instructions[0]);
        // for starting from line 1 and 2 lines per step
        const robots = [];
        for (let index = 1; index < instructions.length; index += 2) {
            const element = instructions[index];
            robots.push({
                coordinates: [parseInt(element.trim().split(' ')[0]), parseInt(element.trim().split(' ')[1])],
                orientation: element.trim().split(' ')[2],
                orders: instructions[index+1].trim().split(''),
            })
        }
        let result = '';
        for (const robot of robots) {
            let newPosition;
            for (const order of robot.orders) {
                if (!newPosition) {
                    newPosition = robot;
                }
                newPosition = await Movements.move(newPosition.coordinates, newPosition.orientation, order, grid);
                if (newPosition.lost) {
                    break;
                }
            }
            result = result + await Movements.encodeOrderString(newPosition.coordinates, newPosition.orientation, newPosition.lost ? true : false);
            if (robot != robots[robots.length -1]) {
                result = result + "\n";
            }
        }
        res.status(200).send(result);
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}