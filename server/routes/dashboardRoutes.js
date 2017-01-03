exports.dashboard = (req, res) => {
  res.render('main',
    {
      title: 'Dashboard',
      pageHeader: 'Dashboard',
      user: req.user,
    });
};

exports.partials = (req, res) => {
  res.render(`partials/${req.params.name}`);
};
