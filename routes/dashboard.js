var featureToggleApi = require('./../src/services/featuretoggle_service.js');

exports.index = function(req, res){
  featureToggleApi.getAllFeatureToggles(function(data) {
    res.render('dashboard', 
               {
                 title: 'Feature toggles', 
                 pageHeader: 'Dashboard',
                 featuretoggles: data,
                 user: req.session.user
               });
               
  });
};

exports.feature = function(req, res) {
  featureToggleApi.getFeatureToggle(req.params.id, function(data) {
    res.render("feature", {
      featuretoggle: data,
      layout: !req.xhr
    });
  });
};