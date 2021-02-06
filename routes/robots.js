const Robots = require('./../controllers/robots');

module.exports = (router) => {
/**
     * @swagger
	 * tags:
	 *  - name: Robots
	 *  description: Calls related to Martian Robots
	 * definitions:
	 *   Input:
	 * 	   properties:
	 * 		  instructions:
	 * 			type: "string"
     *          example: "5 3\n1 1 E\nRFRFFFFFRFRF\n3 2 N\nFRRFLLFFRRFLL\n0 3 W\nLLFFFLFLFL"
*
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
	 *                  example: "gsrggrred"
     *     responses:
     *       200:
     *         description: "An array of apps"
     *       500:
     *         description: "Error response"
     *     operationId: "robotInstructions"
     */
  	router.post('/robots', Robots.postRobots);
};

