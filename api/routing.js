'use strict';

var application = require(__base + '/routes/application');
var audit = require(__base + '/routes/audit');
var features = require(__base + '/routes/feature');
var infrastructure = require(__base + '/routes/infrastructure');

module.exports = {
  register: function (app) {
    application.registerRoutes(app);
    audit.registerRoutes(app);
    features.registerRoutes(app);
    infrastructure.registerRoutes(app);
  }
}
