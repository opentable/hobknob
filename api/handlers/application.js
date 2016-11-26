'use strict';

var applicationService = require(__base + '/services/application');

module.exports = {
  list: function(req, res) {
    applicationService.getAll(function (error, applications) {
      if (error != null) {
        throw error;
      }

      res.send(applications);
    });
  },

  metadata: function(req, res) {
    var applicationName = req.params.name;
    applicationService.buildForApplication(applicationName, function (error, application) {
      if (error != null) {
        throw error;
      }

      res.send(application);
    });
  }
};
