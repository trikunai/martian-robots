module.exports = (chai, url) => new Promise((resolve, reject) => {

    describe('ROBOTS', () => {

        it('it should fail as not instruction passed at body a valid coordinate', (done) => {
            const body = {
            };
            chai.request(url)
                .post('/robots')
                .send(body)
                .end((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        res.should.have.status(500);
                        resolve();
                    }
                    done();
                });
        });
        it('it should fail as not a valid coordinate', (done) => {
            const body = {
                instructions: ""
            };
            chai.request(url)
                .post('/robots')
                .send(body)
                .end((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        res.text.should.eql(`"Provided initial grid 'X' value is not a number"`)
                        res.should.have.status(500);
                        resolve();
                    }
                    done();
                });
        });


        it('it should fail as it X exceeds max grid dimensions', (done) => {
            const body = {
                instructions: "222 1"
            };
            chai.request(url)
                .post('/robots')
                .send(body)
                .end((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        res.should.have.status(500);
                        resolve();
                    }
                    done();
                });
        });


        it('it should fail as it Y exceeds max grid dimensions', (done) => {
            const body = {
                instructions: "5 3\n1 1 E\nRFRxxxxxFRFRF\n3 2 N\nFRRFLLFFRRFLL\n0 3 W\nLLFFFLFLFL"
            };
            chai.request(url)
                .post('/robots')
                .send(body)
                .end((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        res.should.have.status(500);
                        resolve();
                    }
                    done();
                });
        });

        it('it should fail as it initial orientation X is not valid', (done) => {
            const body = {
                instructions: "5 3\n1 1 X\nRFRFRFRF\n3 2 N\nFRRFLLFFRRFLL\n0 3 W\nLLFFFLFLFL"
            };
            chai.request(url)
                .post('/robots')
                .send(body)
                .end((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        res.should.have.status(500);
                        resolve();
                    }
                    done();
                });
        });

        it('it should fail as max orders/instructions limit passed', (done) => {
            const body = {
                instructions: "5 3\n1 1 X\nRFRFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFRFRF\n3 2 N\nFRRFLLFFRRFLL\n0 3 W\nLLFFFLFLFL"
            };
            chai.request(url)
                .post('/robots')
                .send(body)
                .end((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        res.should.have.status(500);
                        resolve();
                    }
                    done();
                });
        });

        it('it should fail as a robot is landed outside grid limits', (done) => {
            const body = {
                instructions: "5 3\n11 1 X\nRFRFRFRF\n3 2 N\nFRRFLLFFRRFLL\n0 3 W\nLLFFFLFLFL"
            };
            chai.request(url)
                .post('/robots')
                .send(body)
                .end((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        res.text.should.eql(`"Robot can not be deployed outside grid. Robot landed at [11,1] outside grid [5,3]"`);
                        res.should.have.status(500);
                        resolve();
                    }
                    done();
                });
        });

        it('it should success and return expected data', (done) => {
            const body = {
                instructions: "5 3\n1 1 E\nRFRFRFRF\n3 2 N\nFRRFLLFFRRFLL\n0 3 W\nLLFFFLFLFL"
            };
            chai.request(url)
                .post('/robots')
                .send(body)
                .end((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        res.should.be.a('object');
                        res.body.should.have.property('output');
                        res.body.should.have.property('robotsStats');
                        res.body.should.have.property('gridStat');
                        res.body.output.should.be.a('string');
                        res.body.robotsStats.should.be.a('array');
                        res.body.gridStat.should.be.a('object');
                        res.body.gridStat.should.have.property('id');
                        res.body.gridStat.should.have.property('totalForwardMovements');
                        res.body.gridStat.should.have.property('totalRightMovements');
                        res.body.gridStat.should.have.property('totalLeftMovements');
                        res.body.gridStat.should.have.property('totalLostRobots');
                        res.should.have.status(200);
                        resolve();
                    }
                    done();
                });
        });
    });
});
