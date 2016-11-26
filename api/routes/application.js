'use strict';

var handler = require(__base + '/handlers/application');

module.exports = {
  registerRoutes: function (app) {
    app.get('/v1/applications/:name', handler.metadata);
    app.get('/v1/applications', handler.list);
  }
};
