'use strict';

module.exports = {
  /*
  {
    user: { name: 'anonymous' } or { name: { givenName: 'anony', familyName: 'mous' } },
    applicationName: 'my-app',
    featureName: 'my-feature',
  }
  */
  addFeature: function(featureEvent, next) {
    next();
  },
  /*
  {
    user: { name: 'anonymous' } or { name: { givenName: 'anony', familyName: 'mous' } },
    applicationName: 'my-app',
    featureName: 'my-feature',
  }
  */
  deleteFeature: function(featureEvent, next) {
    next();
  },
  /*
  {
    user: { name: 'anonymous' } or { name: { givenName: 'anony', familyName: 'mous' } },
    applicationName: 'my-app',
    featureName: 'my-feature',
    toggleName: 'my-toggle',
    value: false
  }
  */
  addFeatureToggle: function(toggleEvent, next) {
    next();
  },
  /*
  {
    user: { name: 'anonymous' } or { name: { givenName: 'anony', familyName: 'mous' } },
    applicationName: 'my-app',
    featureName: 'my-feature',
    toggleName: 'my-toggle',
    value: false
  }
  */
  updateFeatureToggle: function(updateEvent, next) {
    next();
  },
  /*
  {
    user: { name: 'anonymous' } or { name: { givenName: 'anony', familyName: 'mous' } },
    applicationName: 'my-app',
    featureName: 'my-feature',
    toggleName: 'my-toggle'
  }
  */
  deleteFeatureToggle: function(deleteEvent, next) {
    next();
  }
};
