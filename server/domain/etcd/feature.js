

const etcd = require('./etcd');
const _ = require('underscore');
const config = require('config');
const category = require('../category');
const s = require('string');
const hooks = require('../../src/hooks/featureHooks');

const etcdBaseUrl = `http://${config.etcdHost}:${config.etcdPort}/v2/keys/`;

const isMetaNode = function (node) {
  return s(node.key).endsWith('@meta');
};

const getUserDetails = function (req) {
  return config.RequiresAuth ? req.user._json : { name: 'Anonymous' }; // eslint-disable-line no-underscore-dangle
};

const getMetaData = function (featureNode) {
  const metaNode = _.find(featureNode.nodes, n => isMetaNode(n));
  if (metaNode) {
    return JSON.parse(metaNode.value);
  }
  return {
    categoryId: 0
  };
};

const isMultiFeature = function (metaData) {
  return metaData.categoryId !== category.simpleCategoryId;
};

const getNodeName = function (node) {
  const splitKey = node.key.split('/');
  return splitKey[splitKey.length - 1];
};

const getSimpleFeature = function (name, node, description) {
  const value = node.value && node.value.toLowerCase() === 'true';
  return {
    name,
    description,
    values: [value],
    categoryId: 0,
    fullPath: `${etcdBaseUrl}v1/toggles/${name}`
  };
};

const getMultiFeature = function (name, node, metaData, categories, description) {
  const foundCategory = categories[metaData.categoryId];
  const values = _.map(foundCategory.columns, (column) => {
    const columnNode = _.find(node.nodes, c => c.key === `${node.key}/${column}`);
    return columnNode && columnNode.value && columnNode.value.toLowerCase() === 'true';
  });
  return {
    name,
    description,
    values,
    categoryId: metaData.categoryId,
    fullPath: `${etcdBaseUrl}v1/toggles/${name}`
  };
};

const getFeature = function (node, categories, descriptionMap) {
  const name = getNodeName(node);
  if (name === '@meta') {
    return null;
  }

  const description = descriptionMap[name];

  const metaData = getMetaData(node);
  if (isMultiFeature(metaData)) {
    return getMultiFeature(name, node, metaData, categories, description);
  }

  return getSimpleFeature(name, node, description);
};

const handleEtcdNotFoundError = function (err, cb) {
  if (err.errorCode === 100) { // key not found
    cb();
  } else {
    cb(err);
  }
};

const getCategoriesWithFeatureValues = function (applicationNode, descriptionsMap) {
  const categories = category.getCategoriesFromConfig();
  _.each(applicationNode.nodes, (featureNode) => {
    const feature = getFeature(featureNode, categories, descriptionsMap);
    if (feature) {
      categories[feature.categoryId].features.push(feature);
    }
  });
  return categories;
};

const trimEmptyCategoryColumns = function (categories) {
  const featureHasValueAtIndex = function (index) {
    return function (feature) {
      return feature.values[index] !== null && feature.values[index] !== undefined;
    };
  };
  _.each(categories, (foundCategory) => {
    if (foundCategory.id !== 0) {
      const columnsToRemove = [];
      for (let i = 0; i < foundCategory.columns.length; i += 1) {
        const aFeatureHasColumnValue = _.some(foundCategory.features, featureHasValueAtIndex(i));
        if (!aFeatureHasColumnValue) {
          columnsToRemove.push(foundCategory.columns[i]);
        }
      }
      _.each(columnsToRemove, (columnName) => {
        const columnIndex = _.indexOf(foundCategory.columns, columnName);
        foundCategory.columns.splice(columnIndex, 1);
        _.each(foundCategory.features, (feature) => {
          feature.values.splice(columnIndex, 1);
        });
      });
    }
  });
};

const getDescriptionsMap = function (node) {
  const descriptions = _.map(node.nodes, descriptionNode => [getNodeName(descriptionNode), descriptionNode.value]);

  return _.object(descriptions);
};

module.exports.getFeatureCategories = function (applicationName, cb) {
  const path = `v1/toggles/${applicationName}`;
  etcd.client.get(path, { recursive: true }, (err, result) => {
    if (err) {
      handleEtcdNotFoundError(err, cb);
      return;
    }

    etcd.client.get(`v1/metadata/${applicationName}/descriptions`, (descriptionError, descriptionResult) => {
      if (descriptionError) {
        console.log(descriptionError);
      }

      const descriptionsMap = !descriptionError ? getDescriptionsMap(descriptionResult.node) : {};

      const categories = getCategoriesWithFeatureValues(result.node, descriptionsMap);
      trimEmptyCategoryColumns(categories);

      cb(null, {
        categories
      });
    });
  });
};


const getSimpleFeatureToggle = function (featureName, featureNode) {
  return [{
    name: featureName,
    value: featureNode.value === 'true'
  }];
};

const getMultiFeatureToggles = function (featureNode) {
  return _
    .chain(featureNode.nodes)
    .filter(node => !isMetaNode(node))
    .map(node => ({
      name: _.last(node.key.split('/')),
      value: node.value === 'true'
    }))
    .value();
};

const getToggleSuggestions = function (metaData, toggles) {
  const categories = category.getCategoriesFromConfig();
  return _.difference(categories[metaData.categoryId].columns, _.map(toggles, toggle => toggle.name));
};

const getFeatureToggles = function (featureName, feature, cb) {
  const metaData = getMetaData(feature.node);
  const isMulti = isMultiFeature(metaData);

  let toggles;
  let toggleSuggestions;

  if (isMulti) {
    toggles = getMultiFeatureToggles(feature.node);
    toggleSuggestions = getToggleSuggestions(metaData, toggles);
  } else {
    toggles = getSimpleFeatureToggle(featureName, feature.node);
  }

  cb(null, toggles, toggleSuggestions, isMulti);
};

const getFeatureDescription = function (applicationName, feature, cb) {
  const descriptionPath = `v1/metadata/${applicationName}/descriptions`;

  etcd.client.get(descriptionPath, (error, result) => {
    if (error) {
      console.log(error);
    }

    const descriptionsMap = !error ? getDescriptionsMap(result.node) : {};
    const featureDescription = getFeature(feature.node, category.getCategoriesFromConfig(), descriptionsMap).description;

    cb(null, featureDescription);
  });
};

module.exports.getFeature = function (applicationName, featureName, cb) {
  const path = `v1/toggles/${applicationName}/${featureName}`;
  etcd.client.get(path, { recursive: true }, (err, result) => {
    if (err) {
      handleEtcdNotFoundError(err, cb);
      return;
    }

    getFeatureDescription(applicationName, result, (featureErr, featureDescription) => {
      getFeatureToggles(featureName, result, (toggleErr, toggles, toggleSuggestions, isMulti) => {
        cb(null, {
          applicationName,
          featureName,
          featureDescription,
          toggles,
          isMultiToggle: isMulti,
          toggleSuggestions
        });
      });
    });
  });
};

const addFeatureDescription = function (applicationName, featureName, featureDescription, cb) {
  const descriptionPath = `v1/metadata/${applicationName}/descriptions/${featureName}`;

  etcd.client.set(descriptionPath, featureDescription, (err) => {
    if (err) {
      console.log(err); // todo: better logging
    }
    if (cb) cb();
  });
};

const addMultiFeature = function (path, applicationName, featureName, featureDescription, metaData, req, cb) {
  const metaPath = `${path}/@meta`;
  etcd.client.set(metaPath, JSON.stringify(metaData), (err) => {
    if (err) {
      cb(err);
      return;
    }

    addFeatureDescription(applicationName, featureName, featureDescription);

    hooks.run({
      fn: 'addFeature',
      user: getUserDetails(req),
      applicationName,
      featureName,
      value: false
    });

    cb();
  });
};

const addSimpleFeature = function (path, applicationName, featureName, featureDescription, metaData, req, cb) {
  etcd.client.set(path, false, (err) => {
    if (err) {
      return cb(err);
    }

    addFeatureDescription(applicationName, featureName, featureDescription);

    hooks.run({
      fn: 'addFeatureToggle',
      user: getUserDetails(req),
      applicationName,
      featureName,
      toggleName: null,
      value: false
    });

    return cb();
  });
};

module.exports.addFeature = function (applicationName, featureName, featureDescription, categoryId, req, cb) {
  const metaData = {
    categoryId
  };

  const path = `v1/toggles/${applicationName}/${featureName}`;

  const isMulti = isMultiFeature(metaData);

  if (isMulti) {
    addMultiFeature(path, applicationName, featureName, featureDescription, metaData, req, cb);
  } else {
    addSimpleFeature(path, applicationName, featureName, featureDescription, metaData, req, cb);
  }
};

module.exports.updateFeatureToggle = function (applicationName, featureName, value, req, cb) {
  const path = `v1/toggles/${applicationName}/${featureName}`;
  etcd.client.set(path, value, (err) => {
    if (err) {
      cb(err);
      return;
    }

    hooks.run({
      fn: 'updateFeatureToggle',
      user: getUserDetails(req),
      applicationName,
      featureName,
      toggleName: null,
      value
    });

    cb();
  });
};

module.exports.updateFeatureDescription = function (applicationName, featureName, newFeatureDescription, req, cb) {
  addFeatureDescription(applicationName, featureName, newFeatureDescription, cb);
};

module.exports.addFeatureToggle = function (applicationName, featureName, toggleName, req, cb) {
  const path = `v1/toggles/${applicationName}/${featureName}/${toggleName}`;
  etcd.client.set(path, false, (err) => {
    if (err) {
      cb(err);
      return;
    }

    hooks.run({
      fn: 'addFeatureToggle',
      user: getUserDetails(req),
      applicationName,
      featureName,
      toggleName,
      value: false
    });

    cb();
  });
};

module.exports.updateFeatureMultiToggle = function (applicationName, featureName, toggleName, value, req, cb) {
  const path = `v1/toggles/${applicationName}/${featureName}/${toggleName}`;
  etcd.client.set(path, value, (err) => {
    if (err) {
      cb(err);
      return;
    }

    hooks.run({
      fn: 'updateFeatureToggle',
      user: getUserDetails(req),
      applicationName,
      featureName,
      toggleName,
      value
    });

    cb();
  });
};

module.exports.deleteFeature = function (applicationName, featureName, req, cb) {
  const path = `v1/toggles/${applicationName}/${featureName}`;
  etcd.client.delete(path, { recursive: true }, (err) => {
    if (err) cb(err);

    hooks.run({
      fn: 'deleteFeature',
      user: getUserDetails(req),
      applicationName,
      featureName
    });

    cb();
  });
};
