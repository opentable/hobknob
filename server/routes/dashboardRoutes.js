const config = require('config');

exports.dashboard = (req, res) => {
  res.render('main',
    {
      title: 'Dashboard',
      pageHeader: 'Dashboard',
      user: req.user
    });
};

exports.partials = (req, res) => {
  const name = req.params.name;
  res.render(`partials/${name}`);
};
