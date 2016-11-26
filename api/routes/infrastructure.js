'use strict';

var handler = require(__base + '/handlers/infrastructure');

module.exports = {
  registerRoutes: function (app) {
    app.get('/_lbstatus', handler.loadBalancer);
    app.get('/load-balancer', handler.loadBalancer);
    app.get('/service-status', handler.serviceStatus);
  }
};
