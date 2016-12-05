'use strict';

var config = require('./../../config/config.json');
var acl = function() {
  switch (config.dataSource.toLowerCase()) {
    case 'etcd':
      return require('./etcd/acl');

    default:
      return null;
  }
};

module.exports = {
    grant: function (userEmail, resource, callback) {
      acl().grant(userEmail, resource, callback);
    },

    assert: function (userEmail, resource, callback) {
      acl().assert(userEmail, resource, callback);
    },

    revoke: function (userEmail, resource, callback) {
      acl().revoke(userEmail, resource, callback);
    },

    revokeAll: function(resource, callback) {
      acl().revokeAll(resource, callback);
    },

    getAllUsers: function (resource, callback) {
      acl().getAllUsers(resource, callback);
    }
};
