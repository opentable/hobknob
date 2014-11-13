var etcd = require('../etcd'),
    _ = require('underscore'),
    config = require('./../../config/config.json'),
    acl = require('./../acl'),
    audit = require('./../audit'),
    category = require('./category'),
    etcdBaseUrl = "http://" + config.etcdHost + ":" + config.etcdPort + '/v2/keys/',
    S = require('string');

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

var isMultiToggle = function(metaData) {
    return metaData.categoryId !== category.simpleCategoryId;
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

    getApplication: function(applicationName, cb){

        var path = 'v1/toggles/' + applicationName;
        etcd.client.get(path, {recursive: true}, function(err, result){

            if (err) {
                if (err.errorCode === 100){ // key not found
                    cb(null, null);
                } else {
                    cb(err);
                }
                return;
            }

            var categories = category.getCategoriesFromConfig();
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

            cb(null, {
                name: applicationName,
                categories: categories
            });
        });
    },

    getFeature: function(applicationName, featureName, cb) {
        var path = 'v1/toggles/' + applicationName + '/' + featureName;
        etcd.client.get(path, {recursive: true}, function(err, result){

            if (err) {
                if (err.errorCode === 100){ // key not found
                    cb(null, 404);
                } else {
                    cb(err);
                }
                return;
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
                var categories = category.getCategoriesFromConfig();
                remainingToggles = _.difference(categories[metaData.categoryId].columns, _.map(toggles, function(toggle) { return toggle.name; }));
            } else {
                toggles = [{
                    name: featureName,
                    value: result.node.value === 'true'
                }];
            }

            cb(null, {
                applicationName: applicationName,
                featureName: featureName,
                toggles: toggles,
                isMultiToggle: isMulti,
                toggleSuggestions: remainingToggles
            });
        });
    },

    addFeature: function(applicationName, featureName, categoryId, req, cb){
        var metaData = {
            categoryId: categoryId
        };

        var path = 'v1/toggles/' + applicationName + '/' + featureName;
        var metaPath = path + '/@meta';

        var isMulti = isMultiToggle(metaData);

        if (isMulti){
            etcd.client.set(metaPath, JSON.stringify(metaData), function(err){
                if (err) {
                    cb(err);
                    return;
                }

                audit.addFeatureAudit(req, applicationName, featureName, null, null, 'Feature Created', function(err){ 
                   if (err){
                       console.log(err); // todo: better logging
                   }
                });

                cb();
            });
        } else {

            etcd.client.set(path, false, function(err){
                if (err) {
                    cb(err);
                    return;
                }

                audit.addFeatureAudit(req, applicationName, featureName, null, false, 'Created', function(err){
                   if (err){
                       console.log(err); // todo: better logging
                   }
                });

                etcd.client.set(metaPath, JSON.stringify(metaData), function(err){
                   if (err){
                       console.log(err); // todo: better logging
                   }
                    cb();
                });
            });
        }
    },

    updateFeatureToggle: function(applicationName, featureName, value, req, cb){
        var path = 'v1/toggles/' + applicationName + '/' + featureName;
        etcd.client.set(path, value, function(err){
            if (err) {
                cb(err);
                return;
            }

            audit.addFeatureAudit(req, applicationName, featureName, null, value, 'Updated', function(err){
                if (err){
                    console.log(err); // todo: better logging
                }
            });

            cb();
        });
    },

    addFeatureToggle: function(applicationName, featureName, toggleName, req, cb){
        var path = 'v1/toggles/' + applicationName + '/' + featureName +  '/' + toggleName;
        etcd.client.set(path, false, function(err){
            if (err) {
                cb(err);
                return;
            }

            audit.addFeatureAudit(req, applicationName, featureName, toggleName, false, 'Toggle Created', function(err){
                if (err){
                    console.log(err); // todo: better logging
                }
            });

            cb();
        });
    },

    updateFeatureMultiToggle: function(applicationName, featureName, toggleName, value, req, cb){
        var path = 'v1/toggles/' + applicationName + '/' + featureName +  '/' + toggleName;
        etcd.client.set(path, value, function(err){
            if (err) {
                cb(err);
                return;
            }

            audit.addFeatureAudit(req, applicationName, featureName, toggleName, value, 'Updated', function(err){
                if (err){
                    console.log(err); // todo: better logging
                }
            });

            cb();
        });
    },

    deleteFeature: function(applicationName, featureName, req, cb){
        audit.addFeatureAudit(req, applicationName, featureName, null, null, 'Delete Requested', function(err){
            if (err){
                cb(new Error('Could not audit delete request. An audit is required to delete a feature'));
                return;
            }
            var path = 'v1/toggles/' + applicationName + '/' + featureName;
            etcd.client.delete(path, { recursive: true }, function(err){
                if (err) cb(err);
                audit.addFeatureAudit(req, applicationName, featureName, null, null, 'Deleted', function(err) {
                    if (err){
                        console.log(err); // todo: better logging
                    }
                    cb();
                });
            });
        });
    }
};
