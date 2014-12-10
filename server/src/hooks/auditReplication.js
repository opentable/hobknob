var config = require('./../../../config/config.json');

var stub = {
    featureAuditNotification: function(auditNotification, callback) {
        if (callback) {
            callback() ;
        }
    },
    applicationAuditNotification: function(auditNotification, callback) {
        if (callback) {
            callback() ;
        }
    }
};

var auditHook = config.auditHook ? require(config.auditHook.path) : stub;

exports.featureAuditNotification = function(auditNotification, callback) {
    auditHook.featureAuditNotification(auditNotification, callback);
};

exports.applicationAuditNotification = function(auditNotification, callback) {
    auditHook.applicationAuditNotification(auditNotification, callback);
};