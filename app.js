const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();
const port = process.env.PORT || 3000;

app.use(logger('combined'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



const robotsRouter = express.Router();
require('./routes/robots')(robotsRouter);
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

app.listen(port, () => {
	logger(`API service running on port ${port}!`);
});

module.exports = app;
