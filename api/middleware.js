'use strict';

var authentication = require(__base + '/middleware/authentication');

module.exports = {
  configure: function(app) {
    app.use(authentication);
  }
};
