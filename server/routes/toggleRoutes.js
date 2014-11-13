var etcd = require('../etcd'),
    _ = require('underscore'),
    validator = require('validator'),
    config = require('./../../config/config.json'),
    acl = require('./../acl'),
    audit = require('./../audit'),
    etcdBaseUrl = "http://" + config.etcdHost + ":" + config.etcdPort + '/v2/keys/',
    S = require('string');

var getCategoriesFromConfig = function() {
    var simpleCategory = {
        name: "simple",
        id: 0,
        columns: [""],
        features: []
    };
    if (!config.categories) {
        return { 0: _.clone(simpleCategory) };
    }
    var categories = _.map(config.categories, function(category) {
        if (!category.id) {
            var simpleCategoryClone = _.clone(simpleCategory);
            simpleCategoryClone.name = category.name;
            simpleCategoryClone.description = category.description;
            return [0, simpleCategoryClone];
        }
        return [category.id, {
            name: category.name,
            id: category.id,
            description: category.description,
            columns: _.clone(category.values),
            features: []
        }];
    });
    return _.object(categories);
};

var isMetaNode = function(node) {
    return S(node.key).endsWith('@meta');
};

var getMetaData = function(featureNode) {
    var metaNode =  _.find(featureNode.nodes, function(n) { return isMetaNode(n); });
    if (metaNode){
        return JSON.parse(metaNode.value);
    }
    return {
        categoryId: 0
    };
};

var simpleToggleCategoryId = 0;

var isMultiToggle = function(metaData) {
    return metaData.categoryId !== simpleToggleCategoryId;
};

var getNodeName = function(node) {
    var splitKey = node.key.split('/');
    return splitKey[splitKey.length - 1];
};

var getFeature = function(node, parentNode, categories) {
    var name = getNodeName(node);
    var metaData = getMetaData(node);
    if (isMultiToggle(metaData)) {
        var category = categories[metaData.categoryId];
        var values = _.map(category.columns, function(column) {
            var columnNode = _.find(node.nodes, function(c) { return c.key == node.key + '/' + column; });
            return columnNode && columnNode.value && columnNode.value.toLowerCase() === 'true';
        });
        return {
            name: name,
            values: values,
            categoryId: metaData.categoryId,
            fullPath: etcdBaseUrl + 'v1/toggles/' + name
        };
    } else {
        var value = node.value && node.value.toLowerCase() === 'true';
        return {
            name: name,
            values: [ value ],
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
        etcd.client.get(path, {recursive: true}, function(err, result){

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
                var feature = getFeature(node, result.node, categories);
                categories[feature.categoryId].features.push(feature);
            });

            var featureHasValueAtIndex = function(index){
                return function(feature){
                    return feature.values[index] !== null && feature.values[index] !== undefined;
                };
            };
            _.each(categories, function(category){
                if (category.id !== 0){
                    var columnsToRemove = [];
                    for(var i = 0; i < category.columns.length; i++){
                        var aFeatureHasColumnValue = _.some(category.features, featureHasValueAtIndex(i));
                        if (!aFeatureHasColumnValue){
                            columnsToRemove.push(category.columns[i]);
                        }
                    }
                    _.each(columnsToRemove, function(columnName){
                        var columnIndex = _.indexOf(category.columns, columnName);
                        category.columns.splice(columnIndex, 1);
                        _.each(category.features, function(feature){
                            feature.values.splice(columnIndex, 1);
                        });
                    });
                }
            });

            res.send({
                name: applicationName,
                categories: categories
            });
        });
    },

    getFeature: function(req, res) {
        var applicationName = req.params.applicationName;
        var featureName = req.params.featureName;

        var path = 'v1/toggles/' + applicationName + '/' + featureName;
        etcd.client.get(path, {recursive: true}, function(err, result){

            if (err) {
                if (err.errorCode === 100){ // key not found
                    res.send(404);
                    return;
                } else {
                    throw err;
                }
            }

            var metaData = getMetaData(result.node);
            var isMulti = isMultiToggle(metaData);

            var toggles, remainingToggles;
            if (isMulti){
                toggles = _
                    .chain(result.node.nodes)
                    .filter(function(node) { return !isMetaNode(node); })
                    .map(function(node) {
                        return {
                            name: _.last(node.key.split('/')),
                            value: node.value === 'true'
                        };    
                    })
                    .value();
                var categories = getCategoriesFromConfig();
                remainingToggles = _.difference(categories[metaData.categoryId].columns, _.map(toggles, function(toggle) { return toggle.name; }));
            } else {
                toggles = [{
                    name: featureName,
                    value: result.node.value === 'true'
                }];
            }

            res.send({
                applicationName: applicationName,
                featureName: featureName,
                toggles: toggles,
                isMultiToggle: isMulti,
                toggleSuggestions: remainingToggles
            });
        });
    },

    addFeature: function(req, res){
        var applicationName = req.params.applicationName;
        var featureName = req.body.featureName;
        var categoryId = req.body.categoryId;

        var metaData = {
            categoryId: categoryId
        };

        var path = 'v1/toggles/' + applicationName + '/' + featureName;
        var metaPath = path + '/@meta';

        var isMulti = isMultiToggle(metaData);

        if (isMulti){
            etcd.client.set(metaPath, JSON.stringify(metaData), function(err){
                if (err) throw err;

                audit.addFeatureAudit(req, applicationName, featureName, null, null, 'Feature Created', function(err){ 
                   if (err){
                       console.log(err); // todo: better logging
                   }
                });

                res.send(201);
            });
        } else {

            etcd.client.set(path, false, function(err){
                if (err) throw err;

                audit.addFeatureAudit(req, applicationName, featureName, null, false, 'Created', function(err){
                   if (err){
                       console.log(err); // todo: better logging
                   }
                });

                etcd.client.set(metaPath, JSON.stringify(metaData), function(err){
                   if (err){
                       console.log(err); // todo: better logging
                   }
                    res.send(201);
                });
            });
        }
    },

    updateFeatureToggle: function(req, res){
        var applicationName = req.params.applicationName;
        var featureName = req.params.featureName;
        var value = req.body.value;

        var path = 'v1/toggles/' + applicationName + '/' + featureName;
        etcd.client.set(path, value, function(err){
            if (err) throw err;

            audit.addFeatureAudit(req, applicationName, featureName, null, value, 'Updated', function(err){
                if (err){
                    console.log(err); // todo: better logging
                }
            });

            res.send(200);
        });
    },

    addFeatureToggle: function(req, res){
        var applicationName = req.params.applicationName;
        var featureName = req.params.featureName;
        var toggleName = req.body.toggleName;

        var path = 'v1/toggles/' + applicationName + '/' + featureName +  '/' + toggleName;
        etcd.client.set(path, false, function(err){
            if (err) throw err;

            audit.addFeatureAudit(req, applicationName, featureName, toggleName, false, 'Toggle Created', function(err){
                if (err){
                    console.log(err); // todo: better logging
                }
            });

            res.send(200);
        });
    },

    updateFeatureMultiToggle: function(req, res){
        var applicationName = req.params.applicationName;
        var featureName = req.params.featureName;
        var toggleName = req.params.toggleName;
        var value = req.body.value;

        var path = 'v1/toggles/' + applicationName + '/' + featureName +  '/' + toggleName;
        etcd.client.set(path, value, function(err){
            if (err) throw err;

            audit.addFeatureAudit(req, applicationName, featureName, toggleName, value, 'Updated', function(err){
                if (err){
                    console.log(err); // todo: better logging
                }
            });

            res.send(200);
        });
    },

    deleteFeature: function(req, res){
        var applicationName = req.params.applicationName;
        var featureName = req.params.featureName;

        audit.addFeatureAudit(req, applicationName, featureName, null, null, 'Delete Requested', function(err){
            if (err){
                throw new Error('Could not audit delete request. An audit is required to delete a feature');
            }
            var path = 'v1/toggles/' + applicationName + '/' + featureName;
            etcd.client.delete(path, { recursive: true }, function(err){
                if (err) throw err;
                audit.addFeatureAudit(req, applicationName, featureName, null, null, 'Deleted', function(err) {
                    if (err){
                        console.log(err); // todo: better logging
                    }
                    res.send(200);
                });
            });
        });
    }
};