module.exports = (chai, url) => new Promise((resolve, reject) => {

    describe('STATS', () => {

        it('it should get an array with existing grids and its stats', (done) => {
            chai.request(url)
                .get('/grid/stats')
                .end((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        res.body.should.be.a('array');
                        res.should.have.status(200);
                        resolve();
                    }
                    done();
                });
        });

        it('it should get an array with existing robots and its stats', (done) => {
            chai.request(url)
                .get('/robot/stats')
                .end((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        res.body.should.be.a('array');
                        res.should.have.status(200);
                        resolve();
                    }
                    done();
                });
        });
    });
});
