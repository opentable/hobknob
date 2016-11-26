'use strict';

var handler = require(__base + '/handlers/features');

module.exports = {
  registerRoutes: function(app) {
    app.get('/v1/features/:applicationName', handler.allForApplication);
    app.get('/v1/features/:applicationName/:featureName', handler.byName);
    app.post('/v1/features/:applicationName/:featureName', handler.updateMetaData);
    app.put('/v1/features/:applicationName/:featureName/toggle', handler.toggle);
    app.get('/v1/feature-categories', handler.categories);
  }
};
