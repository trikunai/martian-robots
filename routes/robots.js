const Robots = require('./../controllers/robots');

module.exports = (router) => {
/**
     * @swagger
	 *  definitions:
	 *     gridStat:
	 *       type: object
	 *       description: "Explored grid accumulated stats (robots movements at grid)"
	 *       properties:
	 *         id:
	 *           type: integer
	 *           example: 1
	 *           description: "db autoincremental id"
	 *         totalForwardMovements:
	 *           type: integer
	 *           example: 2
	 *           description: "Sum of all forward movements done by all robots in this grid (accumulated)"
	 *         totalRightMovements:
	 *           type: integer
	 *           example: 3
	 *           description: "Sum of all right rotate movements done by all robots in this grid (accumulated)"
	 *         totalLeftMovements:
	 *           type: integer
	 *           example: 4
	 *           description: "Sum of all left rotate movements done by all robots in this grid (accumulated)"
	 *         totalLostRobots:
	 *           type: integer
	 *           example: 5
	 *           description: "Sum of all lost robots in this grid (accumulated)"
	 *         createdAt:
	 *           type: string
	 *           example: "2021-02-06T16:37:53.416Z"
	 *           description: "Grid stat creation datetime string"
	 *         updatedAt:
	 *           type: string
	 *           example: "2021-02-06T16:37:53.416Z"
	 *           description: "Grid stat last update datetime string"
	 *     robotStats:
	 *       type: object
     *       properties:
     *         id:
	 *           type: integer
     *           example: 1
     *           description: "new deployed robot stats id"
     *         idRobot:
     *           type: integer
     *           example: 1
     *           description: "new deployed robot id"
     *         r:
     *           type: integer
     *           example: 2
     *           description: "Sum of all right rotate movements done by this robot until its final coordinates"
     *         l:
     *           type: integer
     *           example: 6
     *           description: "Sum of all left rotate movements done by this robot until its final coordinates"
     *         f:
     *           type: integer
     *           example: 3
     *           description: "Sum of all forward movements done by this robot until its final coordinates"
	 *         createdAt:
	 *           type: string
	 *           example: "2021-02-06T16:37:55.416Z"
	 *           description: "Grid stat creation datetime string"
	 *         updatedAt:
	 *           type: string
	 *           example: "2021-02-06T16:37:55.416Z"
	 *           description: "Grid stat last update datetime string"
     */
/**
     * @swagger
     * /robots:
	 *   post:
	 *     tags:
	 *       - Robots
	 *     description: "Post N multiple rows with instruction.\n\n The first line of input is the upper-right coordinates of the rectangular world.\n\nThe remaining input consists of a sequence of robot positions and instructions (two lines per robot). A position consists of two integers specifying the initial coordinates of the robot and an orientation (N, S, E, W), all separated by whitespace on one line. A robot instruction is a string of the letters 'L', 'R', and 'F' on one line."
	 *     requestBody:
	 *       content:
	 *         application/json:
	 *           schema:
	 *              title: example
	 *              required:
	 *                - instructions
	 *              type: object
	 *              properties:
	 *                instructions:
	 *                  type: string
	 *                  example: "5 3\n1 1 E\nRFRFFFFFRFRF\n3 2 N\nFRRFLLFFRRFLL\n0 3 W\nLLFFFLFLFL"
	 *                  description: "grid, robots, movements instructions lines input"
     *     responses:
     *       200:
     *         description: "An array of apps"
	 *         content:
     *           application/json:
     *             schema:
	 *               type: object
	 *               properties:
	 *                 output:
	 *                   type: string
	 *                   example: "1 1 E\n3 2 N\n2 3 S"
	 *                   description: "Procesed output of the given input"
	 *                 robotStats:
	 *                   type: "array"
	 *                   items:
	 *                     $ref: '#/definitions/robotStats'
	 *                 gridStat:
	 *                   type: object
	 *                   description: "Explored grid accumulated stats (robots movements at grid)"
	 *                   properties:
	 *                     id:
	 *                       type: integer
	 *                       example: 1
	 *                       description: "db autoincremental id"
	 *                     totalForwardMovements:
	 *                       type: integer
	 *                       example: 2
	 *                       description: "Sum of all forward movements done by all robots in this grid (accumulated)"
	 *                     totalRightMovements:
	 *                       type: integer
	 *                       example: 3
	 *                       description: "Sum of all right rotate movements done by all robots in this grid (accumulated)"
	 *                     totalLeftMovements:
	 *                       type: integer
	 *                       example: 4
	 *                       description: "Sum of all left rotate movements done by all robots in this grid (accumulated)"
	 *                     totalLostRobots:
	 *                       type: integer
	 *                       example: 5
	 *                       description: "Sum of all lost robots in this grid (accumulated)"
	 *                     createdAt:
	 *                       type: string
	 *                       example: "2021-02-06T16:37:53.416Z"
	 *                       description: "Grid stat creation datetime string"
	 *                     updatedAt:
	 *                       type: string
	 *                       example: "2021-02-06T16:37:53.416Z"
	 *                       description: "Grid stat last update datetime string"
     *       500:
     *         description: "Error response"
     *     operationId: "robotInstructions"
     */
  	router.post('/robots', Robots.postRobots);
};

