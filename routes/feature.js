var featureToggleApi = require('./../src/services/featuretoggle_service.js');

exports.getById = function(req, res) {
  featureToggleApi.getFeatureToggle(req.params.id, function(data) {
    res.render("feature", {
      featuretoggle: data,
      layout: !req.xhr
    });
  });
};

exports.edit = function(req, res) {
  console.log(req.body);
  console.log("body: " + JSON.stringify(req.body));
  // Send this to alexs new edit api feature
  res.redirect("/dashboard");
};