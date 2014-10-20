var audit = require('./../audit');

module.exports = {
    getToggleAuditTrail: function(req, res){
        var applicationName = req.params.applicationName;
        var toggleName = req.params.toggleName;

        audit.getToggleAuditTrail(applicationName, toggleName, function(err, auditTrail){
            if (err) {
                if (err.errorCode == 100) { // key not found
                    res.send([]);
                    return;
                }
                throw err;
            }
            res.send(auditTrail);
        });
    },

    getApplicationAuditTrail: function(req, res){
        var applicationName = req.params.applicationName;

        audit.getApplicationAuditTrail(applicationName, function(err, auditTrail){
            if (err) {
                if (err.errorCode == 100) { // key not found
                    res.send([]);
                    return;
                }
                throw err;
            }
            res.send(auditTrail);
        });
    }
};