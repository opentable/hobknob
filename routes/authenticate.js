exports.authenticate = function(req, res){
  res.render('authenticate', { layout: 'authenticate', title: 'Feature toggles: Authenticate', pageHeader: 'Authenticate' });
};