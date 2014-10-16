var etcd = require('./etcd'),
    _ = require('underscore');

var EtcdAclStore = function() { };

EtcdAclStore.prototype.grant = function(user, resource, callback) {
    etcd.client.set('v1/toggleAcl/' + resource + '/' + user.email, JSON.stringify(user), function(err){
        if (err) callback(err);
        callback();
    })
};

EtcdAclStore.prototype.assert = function(userEmail, resource, callback) {
    etcd.client.get('v1/toggleAcl/' + resource + '/' + userEmail, function(err){
        if (err) {
            if (err.errorCode == 100) { // key not found
                callback(null, false);
            } else {
                callback(err);
            }
            return;
        }
        callback(null, true);
    })
};

EtcdAclStore.prototype.revoke = function(userEmail, resource, callback) {
    etcd.client.delete('v1/toggleAcl/' + resource + '/' + userEmail, function(err){
        if (err) {
            if (err.errorCode == 100) { // key not found
                callback();
            } else {
                callback(err);
            }
            return;
        }
        callback();
    })
};

EtcdAclStore.prototype.getAllUsers = function(resource, callback) {
    etcd.client.get('v1/toggleAcl/' + resource, { recursive: true }, function(err, result){
        if (err) {
            if (err.errorCode == 100){ // key not found
                callback(null, []);
            } else {
                callback(err);
            }
            return;
        }

        var users = _.map(result.node.nodes || [], function(node){
            return JSON.parse(node.value);
        });
        callback(null, users);
    })
};

module.exports = new EtcdAclStore();