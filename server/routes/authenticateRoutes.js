exports.authenticate = (req, res) => {
  res.render('authenticate', {
    layout: 'authenticate',
    title: 'Feature toggles: Authenticate',
    pageHeader: 'Authenticate',
  });
};

exports.login = (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.render('login');
  }
};

exports.logout = (req, res) => {
  req.logout();
  res.redirect('/login');
};
