const config = require('config');

const acl = () => {
  switch (config.dataSource.toLowerCase()) {
    case 'etcd':
      return require('./etcd/acl');

    default:
      return null;
  }
};

module.exports = {
  grant: (userEmail, resource, callback) => {
    acl().grant(userEmail, resource, callback);
  },

  assert: (userEmail, resource, callback) => {
    acl().assert(userEmail, resource, callback);
  },

  revoke: (userEmail, resource, callback) => {
    acl().revoke(userEmail, resource, callback);
  },

  revokeAll: (resource, callback) => {
    acl().revokeAll(resource, callback);
  },

  getAllUsers: (resource, callback) => {
    acl().getAllUsers(resource, callback);
  }
};
