'use strict';

var config = require('./../../config/config.json');
var audit = function() {
  switch (config.dataSource.toLowerCase()) {
    case 'etcd':
      return require('./etcd/audit');
    case 'redis':
      return require('./redis/audit');
    default:
      return null;
  }
};

module.exports = {
    getApplicationAuditTrail: function (applicationName, callback) {
        audit().getApplicationAuditTrail(applicationName, callback);
    },

    getFeatureAuditTrail: function (applicationName, featureName, callback) {
        audit().getFeatureAuditTrail(applicationName, featureName, callback);
    },

    addApplicationAudit: function (user, applicationName, action, callback) {
        audit().addApplicationAudit(user, applicationName, action, callback);
    },

    addFeatureAudit: function (user, applicationName, featureName, toggleName, value, action, callback) {
        audit().addFeatureAudit(user, applicationName, featureName, toggleName, value, action, callback);
    }
};
