'use strict';

var acl = require('../domain/acl');
var validator = require('validator');

module.exports = {
  getUsers: function (req, res) {
    var applicationName = req.params.applicationName;
    acl.getAllUsers(applicationName, function (err, users) {
      if (err) throw err;
      res.send(users);
    });
  },

  grant: function (req, res) {
    var applicationName = req.params.applicationName;
    var userEmail = req.body.userEmail;
    if (!validator.isEmail(userEmail)) {
      res.status(400).send('Invalid email');
      return;
    }
    acl.grant(userEmail, applicationName, function (err) {
      if (err) throw err;
      res.send(200);
    });
  },

  revoke: function (req, res) {
    var applicationName = req.params.applicationName;
    var userEmail = req.params.userEmail;
    acl.revoke(userEmail, applicationName, function (err) {
      if (err) throw err;
      res.send(200);
    });
  },

  assert: function (req, res) {
    var applicationName = req.params.applicationName;
    var userEmail = req.params.userEmail;
    acl.assert(userEmail, applicationName, function (err, value) {
      res.send({
        authorised: value
      });
    });
  }
};
