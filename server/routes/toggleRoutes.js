var etcd = require('../etcd'),
    _ = require('underscore'),
    validator = require('validator'),
    config = require('./../../config/config.json'),
    acl = require('./../acl'),
    audit = require('./../audit'),
    etcdBaseUrl = "http://" + config.etcdHost + ":" + config.etcdPort + '/v2/keys/';

var getCategoriesFromConfig = function() {
    var simpleCategory = {
        name: "simple",
        id: 0,
        columns: [""],
        features: []
    };
    if (!config.categories) {
        return { 0: simpleCategory };
    }
    var categories = _.map(config.categories, function(category) {
        if (!category.id) {
            simpleCategory.name = category.name;
            return [0, simpleCategory];
        }
        return [category.id, {
            "name": category.name,
            "id": category.id,
            "columns": category.values,
            "features": []
        }];
    });
    return _.object(categories);
};

var getNodeName = function(node) {
    var splitKey = node.key.split('/');
    return splitKey[splitKey.length - 1];
};

var getFeature = function(node, categories) {
    var name = getNodeName(node);
    var metaNode = _.find(node.nodes, function(metaNode) { return metaNode.key == node.key + '/_meta'; });

    var isMultiToggle = metaNode && metaNode.categoryId;
    if (isMultiToggle) {
        var category = categories[metaNode.categoryId];
        var values = _.map(category.columns, function(column) {
            var columnNode = _.find(node.nodes, function(c) { return c.key == node.key + '/' + column; });
            var value = columnNode.value && columnNode.value.toLowerCase() === 'true';
        });
        return {
            name: name,
            values: values,
            categoryId: metaNode.categoryId,
            fullPath: etcdBaseUrl + 'v1/toggles/' + name
        };
    } else {
        var value = node.value && node.value.toLowerCase() === 'true';
        var valueText = value ? 'true' : 'false';
        return {
            name: name,
            values: [ valueText ],
            categoryId: 0,
            fullPath: etcdBaseUrl + 'v1/toggles/' + name
        };
    }
};

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

    getApplication2: function(req, res){
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

            var categories = getCategoriesFromConfig();
            _.each(result.node.nodes, function(node) {
                var feature = getFeature(node);
                categories[feature.categoryId].features.push(feature);
            });

            res.send({
                name: applicationName,
                categories: categories
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