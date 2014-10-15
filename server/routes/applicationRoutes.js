var etcd = require('../etcd'),
    _ = require('underscore'),
    config = require('./../../config/default.json'),
    etcdBaseUrl = "http://" + config.etcdHost + ":" + config.etcdPort + '/v2/keys/';

module.exports = {
    getApplications: function(req, res){
        etcd.client.get('v1/toggles/', {recursive: true}, function(err, result){
            if (err) throw err;

            var applications = _.map(result.node.nodes || [], function(node)
                {
                    var splitKey = node.key.split('/');
                    return splitKey[splitKey.length - 1];
                });
            res.send(applications)
        });
    },

    addApplication: function(req, res){
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
        var path = 'v1/toggles/' + applicationName + '/' + toggleName;
        etcd.client.set(path, value, function(err){
            if (err) throw err;

            res.send(200)
        });
    }
}