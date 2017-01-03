const audit = require('../../domain/audit');

module.exports = {
  /*
   {
   user: { name: 'anonymous' },
   applicationName: 'my-app',
   featureName: 'my-feature',
   }
   */
  addFeature: (featureEvent, next) => {
    audit.addFeatureAudit(
      featureEvent.user,
      featureEvent.applicationName,
      featureEvent.featureName,
      null,
      null,
      'Feature Created', next);
  },
  /*
   {
   user: { name: 'anonymous' },
   applicationName: 'my-app',
   featureName: 'my-feature',
   }
   */
  deleteFeature: (featureEvent, next) => {
    audit.addFeatureAudit(
      featureEvent.user,
      featureEvent.applicationName,
      featureEvent.featureName,
      null,
      null,
      'Deleted', next);
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
  addFeatureToggle: (toggleEvent, next) => {
    audit.addFeatureAudit(
      toggleEvent.user,
      toggleEvent.applicationName,
      toggleEvent.featureName,
      toggleEvent.toggleName,
      toggleEvent.value,
      'Toggle Created', next);
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
  updateFeatureToggle: (updateEvent, next) => {
    audit.addFeatureAudit(
      updateEvent.user,
      updateEvent.applicationName,
      updateEvent.featureName,
      updateEvent.toggleName,
      updateEvent.value,
      'Updated', next);
  },
  /*
   {
   user: { name: 'anonymous' },
   applicationName: 'my-app',
   featureName: 'my-feature',
   toggleName: 'my-toggle'
   }
   */
  deleteFeatureToggle: (deleteEvent, next) => {
    audit.addFeatureAudit(
      deleteEvent.user,
      deleteEvent.applicationName,
      deleteEvent.featureName,
      deleteEvent.toggleName,
      null,
      'Deleted', next);
  },
};
