const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();
const persistData = process.env.PERSIST_DATA && process.env.PERSIST_DATA == 'true'|| false;

const url = 'http://localhost:3000/api';

testRoutes = async () => {
    await robotTest();
    await statsTest();
};

robotTest = () => {
    require('./routes/robots')(chai, url)
        .then(() => {

        })
        .catch(err => {});
}

statsTest = () => {
    require('./routes/stats')(chai, url)
        .then(() => {

        })
        .catch(err => {});
}

testRoutes()