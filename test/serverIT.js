// describe('GET /api/v1/movies/:id', () => {
//     it('should respond with a single movie', (done) => {
//       request.get(`${base}/api/v1/movies/4`, (err, res, body) => {
//         res.statusCode.should.equal(200);
//         res.headers['content-type'].should.contain('application/json');
//         body = JSON.parse(body);
//         body.status.should.eql('success');
//         body.data[0].should.include.keys(
//           'id', 'name', 'genre', 'rating', 'explicit'
//         );
//         body.data[0].name.should.eql('The Land Before Time');
//         done();
//       });
//     });
//     it('should throw an error if the movie does not exist', (done) => {
//       request.get(`${base}/api/v1/movies/999`, (err, res, body) => {
//         res.statusCode.should.equal(404);
//         res.headers['content-type'].should.contain('application/json');
//         body = JSON.parse(body);
//         body.status.should.eql('error');
//         body.message.should.eql('That movie does not exist.');
//         done();
//       });
//     });
//   });
