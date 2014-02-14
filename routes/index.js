exports.index = function(req, res){
  res.render('index', { title: 'Feature toggles' });
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