const audit = require('../domain/audit');

module.exports = {
  getFeatureAuditTrail: (req, res) => {
    const applicationName = req.params.applicationName;
    const featureName = req.params.featureName;

    audit.getFeatureAuditTrail(applicationName, featureName, (err, auditTrail) => {
      if (err) {
        if (err.errorCode === 100) { // key not found
          res.send([]);
          return;
        }
        throw err;
      }
      res.send(auditTrail);
    });
  },

  getApplicationAuditTrail(req, res) {
    const applicationName = req.params.applicationName;

    audit.getApplicationAuditTrail(applicationName, (err, auditTrail) => {
      if (err) {
        if (err.errorCode === 100) { // key not found
          res.send([]);
          return;
        }
        throw err;
      }
      res.send(auditTrail);
    });
  }
};
