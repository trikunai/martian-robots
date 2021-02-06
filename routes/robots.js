const Robots = require('./../controllers/robots');

module.exports = (router) => {
  	router.post('/robots', Robots.postRobots);
};

