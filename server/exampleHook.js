module.exports = {
  /*
   {
   user: { name: 'anonymous' } or { name: { givenName: 'anony', familyName: 'mous' } },
   applicationName: 'my-app',
   featureName: 'my-feature',
   }
   */
  addFeature: (featureEvent, next) => {
    next();
  },
  /*
   {
   user: { name: 'anonymous' } or { name: { givenName: 'anony', familyName: 'mous' } },
   applicationName: 'my-app',
   featureName: 'my-feature',
   }
   */
  deleteFeature: (featureEvent, next) => {
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
  addFeatureToggle: (toggleEvent, next) => {
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
  updateFeatureToggle: (updateEvent, next) => {
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
  deleteFeatureToggle: (deleteEvent, next) => {
    next();
  },
};
