const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const logger = require('morgan');
const database = require('./lib/database');

const app = express();
const port = process.env.PORT || 3000;

app.use(logger('combined'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ---------- PG ------------
try {
	database.sequelize.authenticate().then(() => {
		console.log("connected")
		logger('Connected" to database successfully.');
		database.updateDatabase();
	}).catch((err) => {
		logger(`Unable to connect to the database: ${err}`);
	})
} catch (err) { logger(`Unable to connect to the database: ${err}`); }
// ------------------------------

const robotsRouter = express.Router();
require('./routes/robots')(robotsRouter);
require('./routes/stats')(robotsRouter);
app.use('/api/', robotsRouter);

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, PATCH, OPTIONS');
	res.header(
		'Access-Control-Allow-Headers',
		'Content-Type'
	);
	next();
});

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Martian Robots | Express API with Swagger",
			version: "0.1.0",
			description:
				"This is a simple CRUD API application made with Express and documented with Swagger",
			license: {
				name: "MIT",
				url: "https://spdx.org/licenses/MIT.html",
			},
		},
		servers: [
			{
				url: "http://localhost:3000/api",
			},
		],
	},
	apis: [
		"./routes/robots.js",
		"./routes/stats.js"
	],
};

const specs = swaggerJsdoc(options);

app.use(
	"/api-docs",
	swaggerUi.serve,
	swaggerUi.setup(specs, { explorer: true })
);
// router.use('/api-docs', swaggerUi.serve);
// router.get('/api-docs', swaggerUi.setup(specs, { explorer: true }));

app.listen(port, () => {
	logger(`API service running on port ${port}!`);
});

module.exports = app;
