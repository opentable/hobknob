const acl = require('../domain/acl');
const validator = require('validator');

module.exports = {
  getUsers: (req, res) => {
    const applicationName = req.params.applicationName;
    acl.getAllUsers(applicationName, (err, users) => {
      if (err) throw err;
      res.send(users);
    });
  },

  grant: (req, res) => {
    const applicationName = req.params.applicationName;
    const userEmail = req.body.userEmail;
    if (!validator.isEmail(userEmail)) {
      res.status(400).send('Invalid email');
      return;
    }
    acl.grant(userEmail, applicationName, (err) => {
      if (err) throw err;
      res.send(200);
    });
  },

  revoke: (req, res) => {
    const applicationName = req.params.applicationName;
    const userEmail = req.params.userEmail;
    acl.revoke(userEmail, applicationName, (err) => {
      if (err) throw err;
      res.send(200);
    });
  },

  assert: (req, res) => {
    const applicationName = req.params.applicationName;
    const userEmail = req.params.userEmail;
    acl.assert(userEmail, applicationName, (err, value) => {
      res.send({
        authorised: value,
      });
    });
  },
};
