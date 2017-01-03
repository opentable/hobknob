const application = require('../domain/application');

const getApplications = (req, res) => {
  application.getApplications(
    (err, applications) => {
      if (err) throw err;
      res.send(applications);
    });
};

const addApplication = (req, res) => {
  application.addApplication(req.body.name, req,
    (err) => {
      if (err) throw err;
      res.send(201);
    });
};

const deleteApplication = (req, res) => {
  application.deleteApplication(req.params.applicationName, req,
    (err) => {
      if (err) throw err;
      res.send(200);
    });
};

const deleteApplicationMetaData = (req, res, next) => {
  application.deleteApplicationMetaData(req.params.applicationName, next);
};

const getApplicationMetaData = (req, res) => {
  const applicationName = req.params.applicationName;
  application.getApplicationMetaData(applicationName,
    (err, metaData) => {
      if (err) throw err;
      res.send(metaData);
    });
};

const saveApplicationMetaData = (req, res) => {
  const applicationName = req.params.applicationName;
  const metaDataKey = req.params.metaDataKey;
  const metaDataValue = req.body.value;
  application.saveApplicationMetaData(applicationName, metaDataKey, metaDataValue,
    (err) => {
      if (err) throw err;
      res.send(200);
    });
};

module.exports.registerRoutes = (app, authenticate) => {
  app.get('/api/applications', getApplications);
  app.put('/api/applications', authenticate, addApplication);
  app.delete('/api/applications/:applicationName', authenticate, deleteApplicationMetaData, deleteApplication);
  app.get('/api/applications/:applicationName/_meta', getApplicationMetaData);
  app.put('/api/applications/:applicationName/_meta/:metaDataKey', saveApplicationMetaData);
};
