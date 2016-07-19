'use strict';

var etcd = require('./etcd');
var _ = require('underscore');

var EtcdAclStore = function () {
};

EtcdAclStore.prototype.grant = function (userEmail, resource, callback) {
    etcd.client.set('v1/toggleAcl/' + resource + '/' + userEmail.toLowerCase(), userEmail.toLowerCase(), function (err) {
        if (err) callback(err);
        callback();
    });
};

EtcdAclStore.prototype.assert = function (userEmail, resource, callback) {
    etcd.client.get('v1/toggleAcl/' + resource + '/' + userEmail.toLowerCase(), function (err) {
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

EtcdAclStore.prototype.revoke = function (userEmail, resource, callback) {
    etcd.client.delete('v1/toggleAcl/' + resource + '/' + userEmail.toLowerCase(), function (err) {
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

EtcdAclStore.prototype.revokeAll = function(resource, callback) {
  etcd.client.delete('v1/toggleAcl/' + resource, {recursive: true}, function (err) {
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

EtcdAclStore.prototype.getAllUsers = function (resource, callback) {
    etcd.client.get('v1/toggleAcl/' + resource, {recursive: true}, function (err, result) {
        if (err) {
            if (err.errorCode === 100) { // key not found
                callback(null, []);
            } else {
                callback(err);
            }
            return;
        }

        var users = _.map(result.node.nodes || [], function (node) {
            return node.value;
        });
        callback(null, users);
    });
};

module.exports = new EtcdAclStore();
