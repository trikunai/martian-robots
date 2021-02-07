const Stats = require('./../controllers/stats');

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
     * /grid/stats:
	 *   get:
	 *     tags:
	 *       - Stats
	 *     description: "Get all existing (explored) grid related stats: dimensions, first time explored, sum of right/left/front movements, detected scents"
     *     responses:
     *       200:
     *         description: "Result json object"
     *       500:
     *         description: "Error response"
     *     operationId: "getAllGridStats"
     */
	  router.get('/grid/stats', Stats.getGridStats);

	/**
     * @swagger
     * /grid/{id}/stats:
	 *   get:
	 *     tags:
	 *       - Stats
	 *     description: "Get specific grid related stats: dimensions, first time explored, sum of right/left/front movements, detected scents"
	 *     parameters:
	 *       - name: id
	 *         in: path
	 *         description: "Grid id (idGrid)"
	 *         type: integer
	 *         required: true
     *     responses:
     *       200:
     *         description: "Result json object"
     *       500:
     *         description: "Error response"
     *     operationId: "getGridStat"
     */
	  router.get('/grid/:id/stats', Stats.getGridStat);

	/**
     * @swagger
     * /robot/stats:
	 *   get:
	 *     tags:
	 *       - Stats
	 *     description: "Get all existing (deployed) Robot related stats: starting/end coordinates and orientation, robot deployment date, sum of right/left/front movements, if it is lost"
     *     responses:
     *       200:
     *         description: "Result json object"
     *       500:
     *         description: "Error response"
     *     operationId: "getRobotsStat"
     */
	  router.get('/robot/stats', Stats.getRobotStats);

	/**
     * @swagger
     * /robot/{id}/stats:
	 *   get:
	 *     tags:
	 *       - Stats
	 *     description: "Get specific Robot related stats: starting/end coordinates and orientation, robot deployment date, sum of right/left/front movements, if it is lost"
	 *     parameters:
	 *       - name: id
	 *         in: path
	 *         description: "Robot id (idRobot)"
	 *         type: integer
	 *         required: true
     *     responses:
     *       200:
     *         description: "Result json object"
     *       500:
     *         description: "Error response"
     *     operationId: "getRobotStat"
     */
	  router.get('/robot/:id/stats', Stats.getRobotStat);
};

