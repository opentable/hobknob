var featureToggleApi = require('./../src/services/featuretoggle_service.js');

exports.index = function(req, res){
  res.render('index', { title: 'Feature toggles', pageHeader: 'Dashboard', featuretoggles: featureToggleApi.getFeatureToggles() });
};

exports.togglelist = function(db) {
	return function(req, res) {
		var collection = db.get('featuretogglecollection');
		collection.find({},{},function(e,docs){
			res.render('togglelist', {
				'togglelist' : docs
			});
		});
	};
};
