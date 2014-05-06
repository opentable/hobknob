var featureToggleApi = require('./../src/services/featuretoggle_service.js');

exports.getFeaturesByTag = function(req, res) {
  // This one needs to change so that we call API for tags...but this is not supported yet
  featureToggleApi.getAllFeatureToggles(function(data) {
    res.render('tags', 
               {
                 title: 'Tags', 
                 tag: req.params.name,
                 pageHeader: 'Tags',
                 featuretoggles: data,
                 user: req.session.user
               });
  });
};

