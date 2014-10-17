var etcd = require('../etcd'),
    _ = require('underscore'),
    validator = require('validator'),
    config = require('./../../config/config.json');

module.exports = {
    getAuditTrail: function(req, res){
        var applicationName = req.params.applicationName;
        var toggleName = req.params.toggleName;

        var path = 'v1/toggleAudit/' + applicationName + '/' + toggleName;
        etcd.client.get(path, {recursive: true}, function(err, result){
            if (err) throw err;
            var auditTrail = _.map(result.node.nodes || [], function(node)
                {
                    var auditJson = JSON.parse(node.value);
                    auditJson.createdIndex = node.createdIndex;
                    return auditJson;
                });
            res.send(auditTrail);
        });
    },

    addAudit: function(req, res){
        var applicationName = req.params.applicationName;
        var toggleName = req.params.toggleName;

        var audit = req.body.audit;
        audit.dateModified = new Date().toISOString(); // todo: should be UTC time
        var auditJson = JSON.stringify(audit);

        var path = 'v1/toggleAudit/' + applicationName + '/' + toggleName;
        etcd.client.post(path, auditJson, function(err){
            if (err) throw err;
            res.send(201);
        });
    }
};