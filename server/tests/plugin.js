var http = require('http');
var assert = require('assert');

describe('plugins', function () {
    it('should run the example plugin', function (done) {
        http.get('http://localhost:3006/example-plugin', function (res) {
            assert.equal(res.statusCode, 200);
            done();
        });
    });
});
