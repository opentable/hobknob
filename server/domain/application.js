'use strict';

var etcd = require('../etcd');
var _ = require('underscore');
var config = require('./../../config/config.json');
var acl = require('./../acl');
var audit = require('./../audit');
var etcdBaseUrl = 'http://' + config.etcdHost + ':' + config.etcdPort + '/v2/keys/';

var getUserDetails = function (req) {
    return config.RequiresAuth ? req.user._json : {name: 'Anonymous'};
};

module.exports = {
    getApplications: function (cb) {
        etcd.client.get('v1/toggles/', {recursive: false}, function (err, result) {
            if (err) {
                if (err.errorCode === 100) { // key not found
                    return cb(null, []);
                }

                return cb(err);
            }

            var applications = _.map(result.node.nodes || [], function (node) {
                var splitKey = node.key.split('/');
                return splitKey[splitKey.length - 1];
            });
            cb(null, applications);
        });
    },

    addApplication: function (applicationName, req, cb) {
        var path = 'v1/toggles/' + applicationName;
        etcd.client.mkdir(path, function (err) {
            if (err) {
                return cb(err);
            }

            audit.addApplicationAudit(getUserDetails(req), applicationName, 'Created', function () {
                if (err) {
                    console.log(err); // todo: better logging
                }
            });

            // todo: not sure if this is correct
            if (config.RequiresAuth) {
                var userEmail = getUserDetails(req).email; // todo: need better user management
                acl.grant(userEmail, applicationName, function (grantErr) {
                    if (grantErr) {
                        cb(grantErr);
                        return;
                    }
                    cb();
                });
            } else {
                cb();
            }
        });
    },

    deleteApplication: function (applicationName, req, cb) {
        var path = 'v1/toggles/' + applicationName;
        etcd.client.delete(path, {recursive: true}, function (err) {
            if (err) {
                return cb(err);
            }

            audit.addApplicationAudit(getUserDetails(req), applicationName, 'Deleted', function () {
                if (err) {
                    console.log(err);
                }
            });

            if (config.RequiresAuth) {
                acl.revokeAll(applicationName, function (revokeErr) {
                    if (revokeErr) {
                        return cb(revokeErr);
                    }
                    cb();
                });
            } else {
                cb();
            }
        });
    },

    getApplicationMetaData: function (applicationName, cb) {
        etcd.client.get('v1/metadata/' + applicationName, {recursive: true}, function (err, result) {
            if (err) {
                if (err.errorCode === 100) { // key not found
                    cb(null, {});
                } else {
                    cb(err);
                }
                return;
            }
            var metaDataKeyValues = _.map(result.node.nodes, function (subNode) {
                var metaDataKey = _.last(subNode.key.split('/'));
                return [metaDataKey, subNode.value];
            });
            cb(null, _.object(metaDataKeyValues));
        });
    },

    deleteApplicationMetaData: function (applicationName, cb) {
        etcd.client.delete('v1/metadata/' + applicationName, {recursive: true}, function (err, result) {
            if (err) {
                if (err.errorCode === 100) { // key not found
                    cb();
                } else {
                    cb(err);
                }
                return;
            }
            cb();
        });
    },

    saveApplicationMetaData: function (applicationName, metaDataKey, metaDataValue, cb) {
        var path = 'v1/metadata/' + applicationName + '/' + metaDataKey;
        etcd.client.set(path, metaDataValue, function (err) {
            return cb(err);
        });
    }
};
