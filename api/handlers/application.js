'use strict';

var service = require(__base + '/domain/application');
var featureService = require(__base + '/domain/feature');

module.exports = {
  list: function(req, res) {
    service.getApplications(function (error, applications) {
      if (error != null) {
        throw error;
      }

      res.send(applications);
    });
  },

  metadata: function(req, res) {
    var applicationName = req.params.name;
    service.getApplicationMetaData(applicationName, function (error, applicationMetaData) {
      if (error != null) {
        throw error;
      }

      featureService.getFeatureCategories(applicationName, function (error, features) {
        if (error != null) {
          throw error;
        }

        var model = {
          name: applicationName,
          metaData: applicationMetaData,
          categories: features.categories
        };
        res.send(model);
      });
    });
  }
};
