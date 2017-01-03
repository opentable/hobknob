const ldap = require('ldapjs');

let client;

exports.initLdap = (ip) => {
  client = ldap.createClient({
    url: ip,
  });
};

exports.login = (username, password, callback) => {
  client.bind(username, password, (err) => {
    if (err) {
      console.log(`error in auth: ${err}`);
      callback(false);
      return;
    }
    callback(true);
  });
};
