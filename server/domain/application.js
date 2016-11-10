'use strict';

var config = require('./../../config/config.json');
var application = function() {
  switch (config.dataSource.toLowerCase()) {
    case 'etcd':
      return require('./etcd/application');
    case 'redis':
      return require('./redis/application');
    default:
      return null;
  }
};

module.exports = {
    getApplications: function (cb) {
      application().getApplications(cb);
    },

    addApplication: function (applicationName, req, cb) {
      application().addApplication(applicationName, req, cb);
    },

    deleteApplication: function (applicationName, req, cb) {
      application().deleteApplication(applicationName, req, cb);
    },

    getApplicationMetaData: function (applicationName, cb) {
      application().getApplicationMetaData(applicationName, cb);
    },

    deleteApplicationMetaData: function (applicationName, cb) {
      application().deleteApplicationMetaData(applicationName, cb);
    },

    saveApplicationMetaData: function (applicationName, metaDataKey, metaDataValue, cb) {
      application().saveApplicationMetaData(applicationName, metaDataKey, metaDataValue, cb);
    }
};
