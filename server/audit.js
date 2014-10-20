var etcd = require('./etcd'),
    _ = require('underscore'),
    config = require('./../config/config.json');

var getUserDetails = function(req){
  return config.RequiresAuth ? req.user._json : { name: 'Anonymous'};
};

module.exports = {
    getApplicationAuditTrail: function(applicationName, callback){
        var path = 'v1/audit/application/' + applicationName;
        etcd.client.get(path, {recursive: true}, function(err, result){
            if (err) {
                callback(err);
                return;
            }

            var auditTrail = _.map(result.node.nodes || [], function(node)
                {
                    var auditJson = JSON.parse(node.value);
                    auditJson.createdIndex = node.createdIndex;
                    return auditJson;
                });
            callback(null, auditTrail);
        });
    },

    getToggleAuditTrail: function(applicationName, toggleName, callback){
        var path = 'v1/audit/toggle/' + applicationName + '/' + toggleName;
        etcd.client.get(path, {recursive: true}, function(err, result){
            if (err) {
                callback(err);
                return;
            }

            var auditTrail = _.map(result.node.nodes || [], function(node)
            {
                var auditJson = JSON.parse(node.value);
                auditJson.createdIndex = node.createdIndex;
                return auditJson;
            });
            callback(null, auditTrail);
        });
    },

    addApplicationAudit: function(req, applicationName, action, callback){
        var audit = {
            user: getUserDetails(req),
            action: action,
            dateModified: new Date().toISOString() // todo: should be UTC time
        };
        var auditJson = JSON.stringify(audit);

        var path = 'v1/audit/application/' + applicationName;
        etcd.client.post(path, auditJson, function(err){
            if (err) {
                callback(err);
                return;
            }
            callback();
        });
    },

    addToggleAudit: function(req, applicationName, toggleName, value, action, callback){
        var audit = {
            user: getUserDetails(req),
            value: value,
            action: action,
            dateModified: new Date().toISOString() // todo: should be UTC time
        };
        var auditJson = JSON.stringify(audit);

        var path = 'v1/audit/toggle/' + applicationName + '/' + toggleName;
        etcd.client.post(path, auditJson, function(err){
            if (err) {
                callback(err);
                return;
            }
            callback();
        });
    }
};