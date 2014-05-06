var featureToggleService = require('./../src/services/featuretoggle_service.js'),
    featureMapper = require("./../src/mappers/feature_mapper.js"),

  add = function(req, res) {
    res.render("add", {});
  },

  getAll = function(req, res) {
    featureToggleService.getAllFeatureToggles(function(data) {
      res.send(data);
    })
  }

  getById = function(req, res) {
    featureToggleService.getFeatureToggle(req.params.id, function(data) {
      res.render("feature", {
        featuretoggle: data,
        layout: !req.xhr
      });
    });
  },

  edit = function(req, res) {
    var domainConfigurationModel = featureMapper.map(req.body);

    featureToggleService.updateFeatureToggle(domainConfigurationModel._id, domainConfigurationModel.domainConfiguration, function(result) {
       res.redirect("/dashboard");
    });

  };
    
module.exports = {
  add: add,
  getAll: getAll,
  getById: getById,
  edit: edit
};
