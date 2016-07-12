var audit = require('../../audit');

module.exports = {
  /*
  {
    user: { name: 'anonymous' },
    applicationName: 'my-app',
    featureName: 'my-feature',
  }
  */
  addFeature: function(featureEvent, next){
    audit.addFeatureAudit(
      featureEvent.user,
      featureEvent.applicationName,
      featureEvent.featureName,
      null,
      null,
      'Feature Created', function (err) {
        next(err);
    });
  },
  /*
  {
    user: { name: 'anonymous' },
    applicationName: 'my-app',
    featureName: 'my-feature',
  }
  */
  deleteFeature: function(featureEvent, next){
    audit.addFeatureAudit(
      featureEvent.user,
      featureEvent.applicationName,
      featureEvent.featureName,
      null,
      null,
      'Deleted', function (err) {
        next(err);
    });
  },
  /*
  {
    user: { name: 'anonymous' },
    applicationName: 'my-app',
    featureName: 'my-feature',
    toggleName: 'my-toggle',
    value: false
  }
  */
  addFeatureToggle: function(toggleEvent, next){
    audit.addFeatureAudit(
      toggleEvent.user,
      toggleEvent.applicationName,
      toggleEvent.featureName,
      toggleEvent.toggleName,
      toggleEvent.value,
      'Toggle Created', function (err) {
        next(err);
    });
  },
  /*
  {
    user: { name: 'anonymous' },
    applicationName: 'my-app',
    featureName: 'my-feature',
    toggleName: 'my-toggle',
    value: false
  }
  */
  updateFeatureToggle: function(updateEvent, next){
    audit.addFeatureAudit(
      updateEvent.user,
      updateEvent.applicationName,
      updateEvent.featureName,
      updateEvent.toggleName,
      updateEvent.value,
      'Updated', function (err) {
        next(err);
    });
  },
  /*
  {
    user: { name: 'anonymous' },
    applicationName: 'my-app',
    featureName: 'my-feature',
    toggleName: 'my-toggle'
  }
  */
  deleteFeatureToggle: function(deleteEvent, next){
    audit.addFeatureAudit(
      deleteEvent.user,
      deleteEvent.applicationName,
      deleteEvent.featureName,
      deleteEvent.toggleName,
      null,
      'Deleted', function (err) {
        next(err);
    });
  }
};
