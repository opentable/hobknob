

const etcd = require('./etcd');
const _ = require('underscore');
const config = require('config');

module.exports = {
  getApplicationAuditTrail(applicationName, callback) {
    const path = `v1/audit/application/${applicationName}`;
    etcd.client.get(path, { recursive: true }, (err, result) => {
      if (err) {
        callback(err);
        return;
      }

      const auditTrail = _.map(result.node.nodes || [], (node) => {
        const auditJson = JSON.parse(node.value);
        auditJson.createdIndex = node.createdIndex;
        return auditJson;
      });
      callback(null, auditTrail);
    });
  },

  getFeatureAuditTrail(applicationName, featureName, callback) {
    const path = `v1/audit/feature/${applicationName}/${featureName}`;
    etcd.client.get(path, { recursive: true }, (err, result) => {
      if (err) {
        callback(err);
        return;
      }

      const auditTrail = _.map(result.node.nodes || [], (node) => {
        const auditJson = JSON.parse(node.value);
        auditJson.createdIndex = node.createdIndex;
        return auditJson;
      });
      callback(null, auditTrail);
    });
  },

  addApplicationAudit(user, applicationName, action, callback) {
    const audit = {
      user,
      action,
      dateModified: new Date().toISOString() // todo: should be UTC time
    };
    const auditJson = JSON.stringify(audit);

    const path = `v1/audit/application/${applicationName}`;
    etcd.client.post(path, auditJson, (err) => {
      if (err) {
        callback(err);
        return;
      }

      const auditNotification = {
        applicationName,
        audit
      };

      callback();
    });
  },

  addFeatureAudit(user, applicationName, featureName, toggleName, value, action, callback) {
    const audit = {
      user,
      toggleName,
      value,
      action,
      dateModified: new Date().toISOString() // todo: should be UTC time
    };
    const auditJson = JSON.stringify(audit);

    const path = `v1/audit/feature/${applicationName}/${featureName}`;
    etcd.client.post(path, auditJson, (err) => {
      if (err) {
        callback(err);
        return;
      }

      const auditNotification = {
        applicationName,
        featureName,
        audit
      };

      callback();
    });
  }
};
