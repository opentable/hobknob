var featureToggleApi = require('./../src/services/featuretoggle_service.js');

exports.dashboard = function(req, res){
  featureToggleApi.getAllFeatureToggles(function(data) {
    res.render('dashboard', 
               {
                 title: 'Dashboard', 
                 pageHeader: 'Dashboard',
                 featuretoggles: data,
                 user: req.session.user
               });
               
  });
};
