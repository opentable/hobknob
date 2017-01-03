const config = require('./../../config/config.json');

const audit = () => {
  switch (config.dataSource.toLowerCase()) {
    case 'etcd':
      return require('./etcd/audit'); // eslint-disable-line no-underscore-dangle

    default:
      return null;
  }
};

module.exports = {
  getApplicationAuditTrail: (applicationName, callback) => {
    audit().getApplicationAuditTrail(applicationName, callback);
  },

  getFeatureAuditTrail: (applicationName, featureName, callback) => {
    audit().getFeatureAuditTrail(applicationName, featureName, callback);
  },

  addApplicationAudit: (user, applicationName, action, callback) => {
    audit().addApplicationAudit(user, applicationName, action, callback);
  },

  addFeatureAudit: (user, applicationName, featureName, toggleName, value, action, callback) => {
    audit().addFeatureAudit(user, applicationName, featureName, toggleName, value, action, callback);
  },
};
