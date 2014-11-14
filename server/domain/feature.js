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

var isMultiFeature = function(metaData) {
    return metaData.categoryId !== category.simpleCategoryId;
};

var getNodeName = function(node) {
    var splitKey = node.key.split('/');
    return splitKey[splitKey.length - 1];
};

var getSimpleFeature = function(name, node){
    var value = node.value && node.value.toLowerCase() === 'true';
    return {
        name: name,
        values: [ value ],
        categoryId: 0,
        fullPath: etcdBaseUrl + 'v1/toggles/' + name
    };
};

var getMultiFeature = function(name, node, metaData, categories){
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
};

var getFeature = function(node, categories) {
    var name = getNodeName(node);
    var metaData = getMetaData(node);
    if (isMultiFeature(metaData)) {
        return getMultiFeature(name, node, metaData, categories);
    } else {
        return getSimpleFeature(name, node);
    }
};

var handleEtcdNotFoundError = function(err, cb){
    if (err.errorCode === 100){ // key not found
        cb();
    } else {
        cb(err);
    }
};

var getCategoriesWithFeatureValues = function(applicationNode){
    var categories = category.getCategoriesFromConfig();
    _.each(applicationNode.nodes, function(featureNode) {
        var feature = getFeature(featureNode, categories);
        categories[feature.categoryId].features.push(feature);
    });
    return categories;
};

var trimEmptyCategoryColumns = function(categories){
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
};

module.exports.getFeatureCategories = function(applicationName, cb){

    var path = 'v1/toggles/' + applicationName;
    etcd.client.get(path, {recursive: true}, function(err, result){

        if (err) {
            handleEtcdNotFoundError(err, cb);
            return;
        }

        var categories = getCategoriesWithFeatureValues(result.node);
        trimEmptyCategoryColumns(categories);

        cb(null, {
            categories: categories
        });
    });
};


var getSimpleFeatureToggle = function(featureName, featureNode){
    return [{
        name: featureName,
        value: featureNode.value === 'true'
    }];
};

var getMultiFeatureToggles = function(featureNode){
    return _
        .chain(featureNode.nodes)
        .filter(function(node) { return !isMetaNode(node); })
        .map(function(node) {
            return {
                name: _.last(node.key.split('/')),
                value: node.value === 'true'
            };    
        })
        .value();
};

var getToggleSuggestions = function(metaData, toggles){
    var categories = category.getCategoriesFromConfig();
    return _.difference(categories[metaData.categoryId].columns, _.map(toggles, function(toggle) { return toggle.name; }));
};

module.exports.getFeature = function(applicationName, featureName, cb) {
    var path = 'v1/toggles/' + applicationName + '/' + featureName;
    etcd.client.get(path, {recursive: true}, function(err, result){

        if (err) {
            handleEtcdNotFoundError(err, cb);
            return;
        }

        var metaData = getMetaData(result.node);
        var isMulti = isMultiFeature(metaData);

        var toggles, toggleSuggestions;
        if (isMulti){
            toggles = getMultiFeatureToggles(result.node);
            toggleSuggestions = getToggleSuggestions(metaData, toggles);
        } else {
            toggles = getSimpleFeatureToggle(featureName, result.node);
        }

        cb(null, {
            applicationName: applicationName,
            featureName: featureName,
            toggles: toggles,
            isMultiToggle: isMulti,
            toggleSuggestions: toggleSuggestions
        });
    });
};

var addMultiFeature = function(path, applicationName, featureName, metaData, req, cb){
    var metaPath = path + '/@meta';
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
};

var addSimpleFeature = function(path, applicationName, featureName, metaData, req, cb){
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

        var metaPath = path + '/@meta';
        etcd.client.set(metaPath, JSON.stringify(metaData), function(err){
           if (err){
               console.log(err); // todo: better logging
           }
            cb();
        });
    });
};

module.exports.addFeature = function(applicationName, featureName, categoryId, req, cb){
    var metaData = {
        categoryId: categoryId
    };

    var path = 'v1/toggles/' + applicationName + '/' + featureName;

    var isMulti = isMultiFeature(metaData);

    if (isMulti){
        addMultiFeature(path, applicationName, featureName, metaData, req, cb);
    } else {
        addSimpleFeature(path, applicationName, featureName, metaData, req, cb);
    }
};

module.exports.updateFeatureToggle = function(applicationName, featureName, value, req, cb){
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
};

module.exports.addFeatureToggle = function(applicationName, featureName, toggleName, req, cb){
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
};

module.exports.updateFeatureMultiToggle = function(applicationName, featureName, toggleName, value, req, cb){
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
};

module.exports.deleteFeature = function(applicationName, featureName, req, cb){
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
};
