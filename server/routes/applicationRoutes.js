var etcd = require('../etcd'),
    _ = require('underscore'),
    acl = require('../acl'),
    validator = require('validator'),
    config = require('./../../config/default.json'),
    etcdBaseUrl = "http://" + config.etcdHost + ":" + config.etcdPort + '/v2/keys/';

module.exports = {
    getApplications: function(req, res){
        etcd.client.get('v1/toggles/', {recursive: true}, function(err, result){
            if (err) {
                if (err.errorCode == 100) { // key not found
                    res.send([]);
                    return;
                } else {
                    throw err;
                }
            }

            var applications = _.map(result.node.nodes || [], function(node)
                {
                    var splitKey = node.key.split('/');
                    return splitKey[splitKey.length - 1];
                });
            res.send(applications)
        });
    },

    addApplication: function(req, res){

        // todo: authorise

        var applicationName = req.body.name;
        etcd.client.mkdir('v1/toggles/' + applicationName, function(err){
            if (err) throw err;

            res.send(201)
        })
    },

    getApplication: function(req, res){
        var applicationName = req.params.applicationName;
        var applicationPath = 'v1/toggles/' + applicationName;

        etcd.client.get(applicationPath, {recursive: true}, function(err, result){
            if (err) throw err;

            // todo: 404 if app doesn't exist

            var toggles = _.map(result.node.nodes || [], function(node)
                {
                    var splitKey = node.key.split('/');
                    var name = splitKey[splitKey.length - 1];
                    var value = node.value.toLowerCase() === 'true';
                    return {
                        name: name,
                        value: value,
                        fullPath: etcdBaseUrl + applicationPath + '/' + name
                    };
                });

            if (req.isAuthenticated()){
                acl.assert(req.user.email, applicationName, function(err, value){
                    res.send({
                        name: applicationName,
                        toggles: toggles,
                        userIsApplicationAdmin: !err && value
                    });
                });
            } else {
                res.send({
                    name: applicationName,
                    toggles: toggles,
                    userIsApplicationAdmin: false
                });
            }
        });
    },

    updateToggle: function(req, res){

        // todo: authorise

        var applicationName = req.params.applicationName;
        var toggleName = req.params.toggleName;
        var value = req.body.value;
        var path = 'v1/toggles/' + applicationName + '/' + toggleName;
        etcd.client.set(path, value, function(err){
            if (err) throw err;

            res.send(200)
        });
    },

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
            res.send(auditTrail)
        });
    },

    addAudit: function(req, res){
        var applicationName = req.params.applicationName;
        var toggleName = req.params.toggleName;
        var audit = req.body.audit;
        audit.dateModified = new Date().toISOString(); // todo: should be UTC time
        var auditJson = JSON.stringify(audit);

        var path = 'v1/toggleAudit/' + applicationName + '/' + toggleName;
        etcd.client.post(path, auditJson, function(err, result){
            if (err) throw err;

            res.send(201);
        });
    },

    getUsers: function(req, res){
        var applicationName = req.params.applicationName;
        acl.getAllUsers(applicationName, function(err, users){
            if (err) throw err;
            res.send(users);
        });
    },

    grant: function(req, res){

        // todo: authorise

        var applicationName = req.params.applicationName;
        var user = req.body.user;
        if (!validator.isEmail(user.email)){
            res.status(400).send('Invalid email');
            return;
        }
        acl.grant(user, applicationName, function(err){
            if (err) throw err;
            res.send(200);
        });
    },

    revoke: function(req, res){

        // todo: authorise

        var applicationName = req.params.applicationName;
        var userEmail = req.params.userEmail;
        acl.revoke(userEmail, applicationName, function(err){
            if (err) throw err;
            res.send(200);
        });
    },

    assert: function(req, res){
        var applicationName = req.params.applicationName;
        var userEmail = req.params.userEmail;
        acl.assert(userEmail, applicationName, function(err, value){
            res.send(value);
        });
    }
};