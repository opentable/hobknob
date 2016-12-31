'use strict';

var audit = require('../domain/audit');

module.exports = {
    getFeatureAuditTrail: function (req, res) {
        var applicationName = req.params.applicationName;
        var featureName = req.params.featureName;

        audit.getFeatureAuditTrail(applicationName, featureName, function (err, auditTrail) {
            if (err) {
                throw err;
            }
            res.send(auditTrail);
        });
    },

    getApplicationAuditTrail: function (req, res) {
        var applicationName = req.params.applicationName;

        audit.getApplicationAuditTrail(applicationName, function (err, auditTrail) {
            if (err) {
                throw err;
            }
            res.send(auditTrail);
        });
    }
};
