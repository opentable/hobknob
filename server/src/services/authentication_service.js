'use strict';

var ldap = require('ldapjs');
var client;

exports.initLdap = function (ip) {
  client = ldap.createClient({
    url: ip
  });
};

exports.login = function (username, password, callback) {
  client.bind(username, password, function (err) {
    if (err) {
      console.log('error in auth: ' + err);
      callback(false);
      return;
    }
    callback(true);
  });
};
