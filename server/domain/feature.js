'use strict';

var etcd = require('../etcd');
var _ = require('underscore');
var config = require('./../../config/config.json');
var acl = require('./../acl');
var category = require('./category');
var etcdBaseUrl = 'http://' + config.etcdHost + ':' + config.etcdPort + '/v2/keys/';
var s = require('string');
var hooks = require('../src/hooks/featureHooks');

var isMetaNode = function (node) {
    return s(node.key).endsWith('@meta');
};

var getUserDetails = function (req) {
    return config.RequiresAuth ? req.user._json : {name: 'Anonymous'};
};

var getMetaData = function (featureNode) {
    var metaNode = _.find(featureNode.nodes, function (n) {
        return isMetaNode(n);
    });
    if (metaNode) {
        return JSON.parse(metaNode.value);
    }
    return {
        categoryId: 0
    };
};

var isMultiFeature = function (metaData) {
    return metaData.categoryId !== category.simpleCategoryId;
};

var getNodeName = function (node) {
    var splitKey = node.key.split('/');
    return splitKey[splitKey.length - 1];
};

var getSimpleFeature = function (name, node, description) {
    var value = node.value && node.value.toLowerCase() === 'true';
    return {
        name: name,
        description: description,
        values: [value],
        categoryId: 0,
        fullPath: etcdBaseUrl + 'v1/toggles/' + name
    };
};

var getMultiFeature = function (name, node, metaData, categories, description) {
    var foundCategory = categories[metaData.categoryId];
    var values = _.map(foundCategory.columns, function (column) {
        var columnNode = _.find(node.nodes, function (c) {
            return c.key === node.key + '/' + column;
        });
        return columnNode && columnNode.value && columnNode.value.toLowerCase() === 'true';
    });
    return {
        name: name,
        description: description,
        values: values,
        categoryId: metaData.categoryId,
        fullPath: etcdBaseUrl + 'v1/toggles/' + name
    };
};

var getFeature = function (node, categories, descriptionMap) {
    var name = getNodeName(node);
    if (name === '@meta') {
        return null;
    }

    var description = descriptionMap[name];

    var metaData = getMetaData(node);
    if (isMultiFeature(metaData)) {
        return getMultiFeature(name, node, metaData, categories, description);
    }

    return getSimpleFeature(name, node, description);
};

var handleEtcdNotFoundError = function (err, cb) {
    if (err.errorCode === 100) { // key not found
        cb();
    } else {
        cb(err);
    }
};

var getCategoriesWithFeatureValues = function (applicationNode, descriptionsMap) {
    var categories = category.getCategoriesFromConfig();
    _.each(applicationNode.nodes, function (featureNode) {
        var feature = getFeature(featureNode, categories, descriptionsMap);
        if (feature) {
            categories[feature.categoryId].features.push(feature);
        }
    });
    return categories;
};

var trimEmptyCategoryColumns = function (categories) {
    var featureHasValueAtIndex = function (index) {
        return function (feature) {
            return feature.values[index] !== null && feature.values[index] !== undefined;
        };
    };
    _.each(categories, function (foundCategory) {
        if (foundCategory.id !== 0) {
            var columnsToRemove = [];
            for (var i = 0; i < foundCategory.columns.length; i++) {
                var aFeatureHasColumnValue = _.some(foundCategory.features, featureHasValueAtIndex(i));
                if (!aFeatureHasColumnValue) {
                    columnsToRemove.push(foundCategory.columns[i]);
                }
            }
            _.each(columnsToRemove, function (columnName) {
                var columnIndex = _.indexOf(foundCategory.columns, columnName);
                foundCategory.columns.splice(columnIndex, 1);
                _.each(foundCategory.features, function (feature) {
                    feature.values.splice(columnIndex, 1);
                });
            });
        }
    });
};

var getDescriptionsMap = function (node) {
    var descriptions = _.map(node.nodes, function (descriptionNode) {
        return [getNodeName(descriptionNode), descriptionNode.value];
    });

    return _.object(descriptions);
};

module.exports.getFeatureCategories = function (applicationName, cb) {
    var path = 'v1/toggles/' + applicationName;
    etcd.client.get(path, {recursive: true}, function (err, result) {
        if (err) {
            handleEtcdNotFoundError(err, cb);
            return;
        }

        etcd.client.get('v1/metadata/' + applicationName + '/descriptions', function (descriptionError, descriptionResult) {
            if (descriptionError) {
                console.log(descriptionError);
            }

            var descriptionsMap = !descriptionError ? getDescriptionsMap(descriptionResult.node) : {};

            var categories = getCategoriesWithFeatureValues(result.node, descriptionsMap);
            trimEmptyCategoryColumns(categories);

            cb(null, {
                categories: categories
            });
        });
    });
};


var getSimpleFeatureToggle = function (featureName, featureNode) {
    return [{
        name: featureName,
        value: featureNode.value === 'true'
    }];
};

var getMultiFeatureToggles = function (featureNode) {
    return _
        .chain(featureNode.nodes)
        .filter(function (node) {
            return !isMetaNode(node);
        })
        .map(function (node) {
            return {
                name: _.last(node.key.split('/')),
                value: node.value === 'true'
            };
        })
        .value();
};

var getToggleSuggestions = function (metaData, toggles) {
    var categories = category.getCategoriesFromConfig();
    return _.difference(categories[metaData.categoryId].columns, _.map(toggles, function (toggle) {
        return toggle.name;
    }));
};

module.exports.getFeature = function (applicationName, featureName, cb) {
    var path = 'v1/toggles/' + applicationName + '/' + featureName;
    etcd.client.get(path, {recursive: true}, function (err, result) {
        if (err) {
            handleEtcdNotFoundError(err, cb);
            return;
        }

        getFeatureDescription(applicationName, result, function (featureErr, featureDescription) {
            getFeatureToggles(featureName, result, function (toggleErr, toggles, toggleSuggestions, isMulti) {
                cb(null, {
                    applicationName: applicationName,
                    featureName: featureName,
                    featureDescription: featureDescription,
                    toggles: toggles,
                    isMultiToggle: isMulti,
                    toggleSuggestions: toggleSuggestions
                });
            });
        });
    });
};

var addFeatureDescription = function (applicationName, featureName, featureDescription, cb) {
    var descriptionPath = 'v1/metadata/' + applicationName + '/descriptions/' + featureName;

    etcd.client.set(descriptionPath, featureDescription, function (err) {
        if (err) {
            console.log(err); // todo: better logging
        }
        if (cb) cb();
    });
};

var getFeatureDescription = function (applicationName, feature, cb) {
    var descriptionPath = 'v1/metadata/' + applicationName + '/descriptions';

    etcd.client.get(descriptionPath, function (error, result) {
        if (error) {
            console.log(error);
        }

        var descriptionsMap = !error ? getDescriptionsMap(result.node) : {};
        var featureDescription = getFeature(feature.node, category.getCategoriesFromConfig(), descriptionsMap).description;

        cb(null, featureDescription);
    });
};

var getFeatureToggles = function (featureName, feature, cb) {
    var metaData = getMetaData(feature.node);
    var isMulti = isMultiFeature(metaData);

    var toggles;
    var toggleSuggestions;

    if (isMulti) {
        toggles = getMultiFeatureToggles(feature.node);
        toggleSuggestions = getToggleSuggestions(metaData, toggles);
    } else {
        toggles = getSimpleFeatureToggle(featureName, feature.node);
    }

    cb(null, toggles, toggleSuggestions, isMulti);
};

var addMultiFeature = function (path, applicationName, featureName, featureDescription, metaData, req, cb) {
    var metaPath = path + '/@meta';
    etcd.client.set(metaPath, JSON.stringify(metaData), function (err) {
        if (err) {
            cb(err);
            return;
        }

        addFeatureDescription(applicationName, featureName, featureDescription);

        hooks.run({
          fn: 'addFeature',
          user: getUserDetails(req),
          applicationName: applicationName,
          featureName: featureName,
          value: false
        });

        cb();
    });
};

var addSimpleFeature = function (path, applicationName, featureName, featureDescription, metaData, req, cb) {
    etcd.client.set(path, false, function (err) {
        if (err) {
            return cb(err);
        }

        addFeatureDescription(applicationName, featureName, featureDescription);

        hooks.run({
          fn: 'addFeatureToggle',
          user: getUserDetails(req),
          applicationName: applicationName,
          featureName: featureName,
          toggleName: null,
          value: false
        });

        cb();
    });
};

module.exports.addFeature = function (applicationName, featureName, featureDescription, categoryId, req, cb) {
    var metaData = {
        categoryId: categoryId
    };

    var path = 'v1/toggles/' + applicationName + '/' + featureName;

    var isMulti = isMultiFeature(metaData);

    if (isMulti) {
        addMultiFeature(path, applicationName, featureName, featureDescription, metaData, req, cb);
    } else {
        addSimpleFeature(path, applicationName, featureName, featureDescription, metaData, req, cb);
    }
};

module.exports.updateFeatureToggle = function (applicationName, featureName, value, req, cb) {
    var path = 'v1/toggles/' + applicationName + '/' + featureName;
    etcd.client.set(path, value, function (err) {
        if (err) {
            cb(err);
            return;
        }

        hooks.run({
          fn: 'updateFeatureToggle',
          user: getUserDetails(req),
          applicationName: applicationName,
          featureName: featureName,
          toggleName: null,
          value: false
        });

        cb();
    });
};

module.exports.updateFeatureDescription = function (applicationName, featureName, newFeatureDescription, req, cb) {
    addFeatureDescription(applicationName, featureName, newFeatureDescription, cb);
};

module.exports.addFeatureToggle = function (applicationName, featureName, toggleName, req, cb) {
    var path = 'v1/toggles/' + applicationName + '/' + featureName + '/' + toggleName;
    etcd.client.set(path, false, function (err) {
        if (err) {
            cb(err);
            return;
        }

        hooks.run({
          fn: 'addFeatureToggle',
          user: getUserDetails(req),
          applicationName: applicationName,
          featureName: featureName,
          toggleName: toggleName,
          value: false
        });

        cb();
    });
};

module.exports.updateFeatureMultiToggle = function (applicationName, featureName, toggleName, value, req, cb) {
    var path = 'v1/toggles/' + applicationName + '/' + featureName + '/' + toggleName;
    etcd.client.set(path, value, function (err) {
        if (err) {
            cb(err);
            return;
        }

        hooks.run({
          fn: 'updateFeatureToggle',
          user: getUserDetails(req),
          applicationName: applicationName,
          featureName: featureName,
          toggleName: toggleName,
          value: value
        });

        cb();
    });
};

module.exports.deleteFeature = function (applicationName, featureName, req, cb) {
    var path = 'v1/toggles/' + applicationName + '/' + featureName;
    etcd.client.delete(path, {recursive: true}, function (err) {
        if (err) cb(err);

        hooks.run({
          fn: 'deleteFeature',
          user: getUserDetails(req),
          applicationName: applicationName,
          featureName: featureName
        });

        cb();
    });
};
