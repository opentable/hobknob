'use strict';

var handler = require(__base + '/handlers/application');

module.exports = {
  registerRoutes: function (app) {
    app.get('/applications/:name', handler.byName);
    app.get('/applications', handler.list);
  }
};
