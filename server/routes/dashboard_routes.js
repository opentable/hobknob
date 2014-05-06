var featureToggleApi = require('./../src/services/featuretoggle_service.js');

exports.dashboard = function(req, res){
  featureToggleApi.getAllFeatureToggles(function(data) {
    res.render('main', 
               {
                 title: 'Dashboard', 
                 pageHeader: 'Dashboard',
                 featuretoggles: data,
                 user: req.session.user
               });
               
  });
};

exports.partials = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
};