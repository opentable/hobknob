

const config = require('config');

const application = () => {
  switch (config.dataSource.toLowerCase()) {
    case 'etcd':
      return require('./etcd/application');

    default:
      return null;
  }
};

module.exports = {
  getApplications: (cb) => {
    application().getApplications(cb);
  },

  addApplication: (applicationName, req, cb) => {
    application().addApplication(applicationName, req, cb);
  },

  deleteApplication: (applicationName, req, cb) => {
    application().deleteApplication(applicationName, req, cb);
  },

  getApplicationMetaData: (applicationName, cb) => {
    application().getApplicationMetaData(applicationName, cb);
  },

  deleteApplicationMetaData: (applicationName, cb) => {
    application().deleteApplicationMetaData(applicationName, cb);
  },

  saveApplicationMetaData: (applicationName, metaDataKey, metaDataValue, cb) => {
    application().saveApplicationMetaData(applicationName, metaDataKey, metaDataValue, cb);
  }
};
