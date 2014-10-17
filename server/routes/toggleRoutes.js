var etcd = require('../etcd'),
    _ = require('underscore'),
    validator = require('validator'),
    config = require('./../../config/config.json'),
    acl = require('./../acl');
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
            res.send(applications);
        });
    },

    addApplication: function(req, res){
        var applicationName = req.body.name;

        var path = 'v1/toggles/' + applicationName;
        etcd.client.mkdir(path, function(err){
            if (err) throw err;

            // todo: not sure if this is correct
            if (config.RequiresAuth) {
                var userEmail = req.user._json.email;
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
        etcd.client.get(path, {recursive: true}, function(err, result){

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
                    var value = node.value.toLowerCase() === 'true';
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

    updateToggle: function(req, res){
        var applicationName = req.params.applicationName;
        var toggleName = req.params.toggleName;
        var value = req.body.value;
        console.log(value);

        var path = 'v1/toggles/' + applicationName + '/' + toggleName;
        etcd.client.set(path, value, function(err){
            if (err) throw err;
            res.send(200);
        });
    }
};