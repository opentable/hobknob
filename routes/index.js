var featureToggleApi = require('./../src/services/featuretoggle_service.js');

exports.index = function(req, res){
  featureToggleApi.getAllFeatureToggles(function(data) {
    res.render('index', 
               {
                 title: 'Feature toggles', 
                 pageHeader: 'Dashboard',
                 featuretoggles: data
               });
               
  });
};
