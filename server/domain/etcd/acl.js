const etcd = require('./etcd');
const _ = require('underscore');

const EtcdAclStore = function () {};

EtcdAclStore.prototype.grant = (userEmail, resource, callback) => {
  etcd.client.set(`v1/toggleAcl/${resource}/${userEmail.toLowerCase()}`, userEmail.toLowerCase(), (err) => {
    if (err) callback(err);
    callback();
  });
};

EtcdAclStore.prototype.assert = (userEmail, resource, callback) => {
  etcd.client.get(`v1/toggleAcl/${resource}/${userEmail.toLowerCase()}`, (err) => {
    if (err) {
      if (err.errorCode === 100) { // key not found
        callback(null, false);
      } else {
        callback(err);
      }
      return;
    }
    callback(null, true);
  });
};

EtcdAclStore.prototype.revoke = (userEmail, resource, callback) => {
  etcd.client.delete(`v1/toggleAcl/${resource}/${userEmail.toLowerCase()}`, (err) => {
    if (err) {
      if (err.errorCode === 100) { // key not found
        callback();
      } else {
        callback(err);
      }
      return;
    }
    callback();
  });
};

EtcdAclStore.prototype.revokeAll = (resource, callback) => {
  etcd.client.delete(`v1/toggleAcl/${resource}`, { recursive: true }, (err) => {
    if (err) {
      if (err.errorCode === 100) { // key not found
        callback();
      } else {
        callback(err);
      }
      return;
    }
    callback();
  });
};

EtcdAclStore.prototype.getAllUsers = (resource, callback) => {
  etcd.client.get(`v1/toggleAcl/${resource}`, { recursive: true }, (err, result) => {
    if (err) {
      if (err.errorCode === 100) { // key not found
        callback(null, []);
      } else {
        callback(err);
      }
      return;
    }

    const users = _.map(result.node.nodes || [], node => node.value);
    callback(null, users);
  });
};

module.exports = new EtcdAclStore();
