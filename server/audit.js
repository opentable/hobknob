'use strict';

var etcd = require('./etcd');
var _ = require('underscore');
var config = require('./../config/config.json');

module.exports = {
    getApplicationAuditTrail: function (applicationName, callback) {
        var path = 'v1/audit/application/' + applicationName;
        etcd.client.get(path, {recursive: true}, function (err, result) {
            if (err) {
                callback(err);
                return;
            }

            var auditTrail = _.map(result.node.nodes || [], function (node) {
                var auditJson = JSON.parse(node.value);
                auditJson.createdIndex = node.createdIndex;
                return auditJson;
            });
            callback(null, auditTrail);
        });
    },

    getFeatureAuditTrail: function (applicationName, featureName, callback) {
        var path = 'v1/audit/feature/' + applicationName + '/' + featureName;
        etcd.client.get(path, {recursive: true}, function (err, result) {
            if (err) {
                callback(err);
                return;
            }

            var auditTrail = _.map(result.node.nodes || [], function (node) {
                var auditJson = JSON.parse(node.value);
                auditJson.createdIndex = node.createdIndex;
                return auditJson;
            });
            callback(null, auditTrail);
        });
    },

    addApplicationAudit: function (user, applicationName, action, callback) {
        var audit = {
            user: user,
            action: action,
            dateModified: new Date().toISOString() // todo: should be UTC time
        };
        var auditJson = JSON.stringify(audit);

        var path = 'v1/audit/application/' + applicationName;
        etcd.client.post(path, auditJson, function (err) {
            if (err) {
                callback(err);
                return;
            }

            var auditNotification = {
                applicationName: applicationName,
                audit: audit
            };

            callback();
        });
    },

    addFeatureAudit: function (user, applicationName, featureName, toggleName, value, action, callback) {
        var audit = {
            user: user,
            toggleName: toggleName,
            value: value,
            action: action,
            dateModified: new Date().toISOString() // todo: should be UTC time
        };
        var auditJson = JSON.stringify(audit);

        var path = 'v1/audit/feature/' + applicationName + '/' + featureName;
        etcd.client.post(path, auditJson, function (err) {
            if (err) {
                callback(err);
                return;
            }

            var auditNotification = {
                applicationName: applicationName,
                featureName: featureName,
                audit: audit
            };

            callback();
        });
    }
};
