var etcd = require('../etcd'),
    _ = require('underscore'),
    validator = require('validator'),
    config = require('./../../config/config.json'),
    acl = require('./../acl'),
    audit = require('./../audit'),
    etcdBaseUrl = "http://" + config.etcdHost + ":" + config.etcdPort + '/v2/keys/';

module.exports = {
    getApplications: function(req, res){
        etcd.client.get('v1/toggles/', {recursive: false}, function(err, result){
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
            res.send(applications);
        });
    },

    addApplication: function(req, res){
        var applicationName = req.body.name;

        var path = 'v1/toggles/' + applicationName;
        etcd.client.mkdir(path, function(err){
            if (err) throw err;

            audit.addApplicationAudit(req, applicationName, 'Created', function(){
               if (err){
                   console.log(err); // todo: better logging
               }
            });

            // todo: not sure if this is correct
            if (config.RequiresAuth) {
                var userEmail = req.user._json.email; // todo: need better user management
                acl.grant(userEmail, applicationName, function (err) {
                    if (err) throw err;
                    res.send(201);
                });
            } else {
                res.send(201);
            }
        });
    },

    getApplication: function(req, res){
        var applicationName = req.params.applicationName;

        var path = 'v1/toggles/' + applicationName;
        etcd.client.get(path, {recursive: false}, function(err, result){

            if (err) {
                if (err.errorCode === 100){ // key not found
                    res.send(404);
                    return;
                } else {
                    throw err;
                }
            }

            var toggles = _.map(result.node.nodes || [], function(node)
                {
                    var splitKey = node.key.split('/');
                    var name = splitKey[splitKey.length - 1];
                    var value = node.value && node.value.toLowerCase() === 'true';
                    return {
                        name: name,
                        value: value,
                        fullPath: etcdBaseUrl + path + '/' + name
                    };
                });

            res.send({
                name: applicationName,
                toggles: toggles
            });
        });
    },

    addToggle: function(req, res){
        var applicationName = req.params.applicationName;
        var toggleName = req.body.toggleName;
        var value = req.body.value;

        var path = 'v1/toggles/' + applicationName + '/' + toggleName;
        etcd.client.set(path, value, function(err){
            if (err) throw err;

            audit.addToggleAudit(req, applicationName, toggleName, value, 'Created', function(err){
               if (err){
                   console.log(err); // todo: better logging
               }
            });

            res.send(201);
        });
    },

    updateToggle: function(req, res){
        var applicationName = req.params.applicationName;
        var toggleName = req.params.toggleName;
        var value = req.body.value;

        var path = 'v1/toggles/' + applicationName + '/' + toggleName;
        etcd.client.set(path, value, function(err){
            if (err) throw err;

            audit.addToggleAudit(req, applicationName, toggleName, value, 'Updated', function(err){
                if (err){
                    console.log(err); // todo: better logging
                }
            });

            res.send(200);
        });
    },

    deleteToggle: function(req, res){
        var applicationName = req.params.applicationName;
        var toggleName = req.params.toggleName;

        audit.addToggleAudit(req, applicationName, toggleName, null, 'Delete Requested', function(err){
            if (err){
                throw new Error('Could not audit delete request. An audit is required to delete a toggle.');
            }
            var path = 'v1/toggles/' + applicationName + '/' + toggleName;
            etcd.client.delete(path, function(err){
                if (err) throw err;
                audit.addToggleAudit(req, applicationName, toggleName, null, 'Deleted', function(err) {
                    if (err){
                        console.log(err); // todo: better logging
                    }
                    res.send(200);
                });
            });
        });
    }
};