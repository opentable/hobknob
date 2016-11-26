'use strict';

var applicationService = require(__base + '/domain/application');
var auditService       = require(__base + '/domain/audit');
var featureService     = require(__base + '/domain/feature');

module.exports = {
  buildForApplication: function(applicationName, done) {
    // TODO: make this less nasty
    applicationService.getApplicationMetaData(applicationName, function (error, applicationMetaData) {
      if (error != null) {
        done(error, null);
        return;
      }

      featureService.getFeatureCategories(applicationName, function (error, features) {
        if (error != null) {
          done(error, null);
          return;
        }

        auditService.getApplicationAuditTrail(applicationName, function(error, applicationAuditTrail) {
          if (error != null) {
            done(error, null);
            return;
          }

          var model = {
            name: applicationName,
            metaData: applicationMetaData,
            categories: features.categories,
            audit: applicationAuditTrail
          };
          done(null, model);
        });
      });
    });
  },

  getAll: function (done) {
    applicationService.getApplications(function (error, applications) {
      if (error != null) {
        done(error, null);
        return;
      }

      done(null, applications);
    });
  }
};
