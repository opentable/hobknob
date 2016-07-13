'use strict';

var application = require('./../domain/application');

var getApplications = function (req, res) {
    application.getApplications(
        function (err, applications) {
            if (err) throw err;
            res.send(applications);
        });
};

var addApplication = function (req, res) {
    application.addApplication(req.body.name, req,
        function (err) {
            if (err) throw err;
            res.send(201);
        });
};

var deleteApplication = function (req, res) {
    application.deleteApplication(req.params.applicationName, req,
      function (err) {
          if (err) throw err;
          res.send(200);
      });
};

var deleteApplicationMetaData = function (req, res, next) {
    application.deleteApplicationMetaData(req.params.applicationName, next);
};

var getApplicationMetaData = function (req, res) {
    var applicationName = req.params.applicationName;
    application.getApplicationMetaData(applicationName,
        function (err, metaData) {
            if (err) throw err;
            res.send(metaData);
        });
};

var saveApplicationMetaData = function (req, res) {
    var applicationName = req.params.applicationName;
    var metaDataKey = req.params.metaDataKey;
    var metaDataValue = req.body.value;
    application.saveApplicationMetaData(applicationName, metaDataKey, metaDataValue,
        function (err) {
            if (err) throw err;
            res.send(200);
        });
};

module.exports.registerRoutes = function (app, authenticate) {
    app.get('/api/applications', getApplications);
    app.put('/api/applications', authenticate, addApplication);
    app.delete('/api/applications/:applicationName', authenticate, deleteApplicationMetaData, deleteApplication);
    app.get('/api/applications/:applicationName/_meta', getApplicationMetaData);
    app.put('/api/applications/:applicationName/_meta/:metaDataKey', saveApplicationMetaData);
};
