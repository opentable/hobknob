var featureToggleService = require('./../src/services/featuretoggle_service.js'),
    featureMapper = require("./../src/mappers/feature_mapper.js");

exports.getById = function(req, res) {
  featureToggleService.getFeatureToggle(req.params.id, function(data) {
    res.render("feature", {
      featuretoggle: data,
      layout: !req.xhr
    });
  });
};

exports.edit = function(req, res) {
  var domainConfigurationModel = featureMapper.map(req.body);

  featureToggleService.updateFeatureToggle(domainConfigurationModel._id, domainConfigurationModel.domainConfiguration, function(result) {
     res.redirect("/dashboard");
  });
  
};