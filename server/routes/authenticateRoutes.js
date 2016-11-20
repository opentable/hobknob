'use strict';

exports.authenticate = function (req, res) {
  res.render('authenticate', {
    layout: 'authenticate',
    title: 'Feature toggles: Authenticate',
    pageHeader: 'Authenticate'
  });
};

exports.login = function (req, res) {
  if (req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.render('login');
  }
};

exports.logout = function (req, res) {
  req.logout();
  res.redirect('/login');
};
