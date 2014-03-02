var featureToggleApi = require('./../src/services/featuretoggle_service.js');

exports.index = function(req, res){
  featureToggleApi.getAllFeatureToggles(function(data) {
    res.render('dashboard', 
               {
                 title: 'Feature toggles', 
                 pageHeader: 'Dashboard',
                 featuretoggles: data
               });
               
  });
};

exports.feature = function(req, res) {
  console.log("ID sent is:" + req.params.id);
  featureToggleApi.getFeatureToggle(req.params.id, function(data) {
    console.log("feature : " + data);
    //res.send(data);
    res.render("feature", {
      featuretoggle: data,
      layout: !req.xhr
    });
  });
};