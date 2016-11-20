const http = require('http');
const assert = require('assert');

describe('plugins', () => {
  it('should run the example plugin', (done) => {
    http.get('http://localhost:3006/example-plugin', (res) => {
      assert.equal(res.statusCode, 200);
      done();
    });
  });
});
