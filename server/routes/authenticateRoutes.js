exports.authenticate = function(req, res) {
  res.render('authenticate', { layout: 'authenticate', title: 'Feature toggles: Authenticate', pageHeader: 'Authenticate' });
};

exports.login = function(req, res) {
  if (req.isAuthenticated()){
    res.redirect("/");
  } 
  else{
      res.render('login');
  } 
};

exports.logout = function(req, res) {
  if (req.session.user) {
    delete req.session.user;
  }
  res.redirect("/login");
};