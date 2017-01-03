

const config = require('config');

const feature = () => {
  switch (config.dataSource.toLowerCase()) {
    case 'etcd':
      return require('./etcd/feature');

    default:
      return null;
  }
};

module.exports = {
  getFeatureCategories: (applicationName, cb) => {
    feature().getFeatureCategories(applicationName, cb);
  },

  getFeature: (applicationName, featureName, cb) => {
    feature().getFeature(applicationName, featureName, cb);
  },

  addFeature: (applicationName, featureName, featureDescription, categoryId, req, cb) => {
    feature().addFeature(applicationName, featureName, featureDescription, categoryId, req, cb);
  },

  updateFeatureToggle: (applicationName, featureName, value, req, cb) => {
    feature().updateFeatureToggle(applicationName, featureName, value, req, cb);
  },

  updateFeatureDescription: (applicationName, featureName, value, req, cb) => {
    feature().updateFeatureDescription(applicationName, featureName, newFeatureDescription, req, cb);
  },

  addFeatureToggle: (applicationName, featureName, toggleName, req, cb) => {
    feature().addFeatureToggle(applicationName, featureName, toggleName, req, cb);
  },

  updateFeatureMultiToggle: (applicationName, featureName, toggleName, value, req, cb) => {
    feature().updateFeatureMultiToggle(applicationName, featureName, toggleName, value, req, cb);
  },

  deleteFeature: (applicationName, featureName, req, cb) => {
    feature().deleteFeature(applicationName, featureName, req, cb);
  }
};
