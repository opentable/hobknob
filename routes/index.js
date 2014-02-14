exports.index = function(req, res){
  res.render('index', { title: 'Feature toggles', pageHeader: 'Dashboard', featuretoggles: getFeatureToggles() });
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

var getFeatureToggles = function() {
	var featureToggles = [{
		"Id": 1,
		"Name": "Toggle 1",
		"State": "active"
	},
	{
		"Id": 2,
		"Name": "Toggle 2",
		"State": "active"
	},
	{
		"Id": 3,
		"Name": "Toggle 3",
		"State": "active"
	}]
	
	return featureToggles;
};