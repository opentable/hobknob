'use strict';

var config = require('config');
var common = require('./common');
var audit = require('./audit');
var acl = require('./acl');

var application = function() {
  switch (config.dataSource.toLowerCase()) {
    case 'etcd':
      return require('./etcd/application');

    default:
      return null;
  }
};

module.exports = {
    getApplications: function (cb) {
      application().getApplications(cb);
    },

    addApplication: function (applicationName, req, cb) {
      application().addApplication(applicationName, req, function(err) {
        if (err) {
            return cb(err);
        }

        var userDetails = common.getUserDetails(req)

        audit.addApplicationAudit(userDetails, applicationName, 'Created', function () {
            if (err) {
                cb(err);
                return;
            }
        });

        if (config.RequiresAuth) {
            var userEmail = userDetails.email.toLowerCase(); // todo: need better user management
            acl.grant(userEmail, applicationName, function (grantErr) {
                if (grantErr) {
                    cb(grantErr);
                    return;
                }
                cb();
            });
        } else {
            cb();
        }
      });
    },

    deleteApplication: function (applicationName, req, cb) {
      application().deleteApplication(applicationName, req, function (err) {
          if (err) {
              return cb(err);
          }

          audit.addApplicationAudit(common.getUserDetails(req), applicationName, 'Deleted', function () {
              if (err) {
                  console.log(err);
              }
          });

          if (config.RequiresAuth) {
              acl.revokeAll(applicationName, function (revokeErr) {
                  if (revokeErr) {
                      return cb(revokeErr);
                  }
                  cb();
              });
          } else {
              cb();
          }
      });
    },

    getApplicationMetaData: function (applicationName, cb) {
      application().getApplicationMetaData(applicationName, cb);
    },

    deleteApplicationMetaData: function (applicationName, cb) {
      application().deleteApplicationMetaData(applicationName, cb);
    },

    saveApplicationMetaData: function (applicationName, metaDataKey, metaDataValue, cb) {
      application().saveApplicationMetaData(applicationName, metaDataKey, metaDataValue, cb);
    }
};
