'use strict';

var acl = function() {
  switch (config.dataSource.toLower()) {
    case 'etcd':
      return require('./etcd/acl');

    case 'consul':
      return require('./consul/acl');

    default:
      return null;
  }
}();

module.exports = {
    grant: function (userEmail, resource, callback) {
      acl.grant(userEmail, resource, callback);
    },

    assert: function (userEmail, resource, callback) {
      acl.assert(userEmail, resource, callback);
    },

    revoke: function (userEmail, resource, callback) {
      acl.revoke(userEmail, resource, callback);
    },

    revokeAll: function(resource, callback) {
      acl.revokeAll(resource, callback);
    },

    getAllUsers: function (resource, callback) {
      acl.getAllUsers(resource, callback);
    }
};
