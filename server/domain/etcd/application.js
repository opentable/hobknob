

const etcd = require('./etcd');
const _ = require('underscore');
const config = require('config');
const acl = require('../acl');
const audit = require('../audit');

const getUserDetails = function (req) {
  return config.RequiresAuth ? req.user._json : { name: 'Anonymous' }; // eslint-disable-line no-underscore-dangle
};

module.exports = {
  getApplications(cb) {
    etcd.client.get('v1/toggles/', { recursive: false }, (err, result) => {
      if (err) {
        if (err.errorCode === 100) { // key not found
          return cb(null, []);
        }

        return cb(err);
      }

      const applications = _.map(result.node.nodes || [], (node) => {
        const splitKey = node.key.split('/');
        return splitKey[splitKey.length - 1];
      });
      return cb(null, applications);
    });
  },

  addApplication(applicationName, req, cb) {
    const path = `v1/toggles/${applicationName}`;
    etcd.client.mkdir(path, (err) => {
      if (err) {
        return cb(err);
      }

      audit.addApplicationAudit(getUserDetails(req), applicationName, 'Created', () => {
        if (err) {
          console.log(err); // todo: better logging
        }
      });

      // todo: not sure if this is correct
      if (config.RequiresAuth) {
        const userEmail = getUserDetails(req).email.toLowerCase(); // todo: need better user management
        acl.grant(userEmail, applicationName, (grantErr) => {
          if (grantErr) {
            cb(grantErr);
            return;
          }
          cb();
        });
      } else {
        return cb();
      }

      return null;
    });
  },

  deleteApplication(applicationName, req, cb) {
    const path = `v1/toggles/${applicationName}`;
    etcd.client.delete(path, { recursive: true }, (err) => {
      if (err) {
        return cb(err);
      }

      audit.addApplicationAudit(getUserDetails(req), applicationName, 'Deleted', () => {
        if (err) {
          console.log(err);
        }
      });

      if (config.RequiresAuth) {
        acl.revokeAll(applicationName, (revokeErr) => {
          if (revokeErr) {
            return cb(revokeErr);
          }
          return cb();
        });
      } else {
        return cb();
      }

      return null;
    });
  },

  getApplicationMetaData(applicationName, cb) {
    etcd.client.get(`v1/metadata/${applicationName}`, { recursive: true }, (err, result) => {
      if (err) {
        if (err.errorCode === 100) { // key not found
          cb(null, {});
        } else {
          cb(err);
        }
        return;
      }
      const metaDataKeyValues = _.map(result.node.nodes, (subNode) => {
        const metaDataKey = _.last(subNode.key.split('/'));
        return [metaDataKey, subNode.value];
      });
      cb(null, _.object(metaDataKeyValues));
    });
  },

  deleteApplicationMetaData(applicationName, cb) {
    etcd.client.delete(`v1/metadata/${applicationName}`, { recursive: true }, (err, result) => {
      if (err) {
        if (err.errorCode === 100) { // key not found
          cb();
        } else {
          cb(err);
        }
        return;
      }
      cb();
    });
  },

  saveApplicationMetaData(applicationName, metaDataKey, metaDataValue, cb) {
    const path = `v1/metadata/${applicationName}/${metaDataKey}`;
    etcd.client.set(path, metaDataValue, err => cb(err));
  }
};
