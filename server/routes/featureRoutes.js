const feature = require('../domain/feature');

const getFeatureCategories = (req, res) => {
  feature.getFeatureCategories(req.params.applicationName,
    (err, application) => {
      if (err) throw err;

      if (application) {
        res.send(application);
      } else {
        res.send(404);
      }
    });
};

const getFeature = (req, res) => {
  const applicationName = req.params.applicationName;
  const featureName = req.params.featureName;

  feature.getFeature(applicationName, featureName, (err, foundFeature) => {
    if (err) throw err;
    if (foundFeature) {
      res.send(foundFeature);
    } else {
      res.send(404);
    }
  });
};

const addFeature = (req, res) => {
  const applicationName = req.params.applicationName;
  const featureName = req.body.featureName;
  const featureDescription = req.body.featureDescription;
  const categoryId = req.body.categoryId;

  feature.addFeature(applicationName, featureName, featureDescription, categoryId, req, (err) => {
    if (err) throw err;
    res.send(201);
  });
};

const updateFeatureDescription = (req, res) => {
  const applicationName = req.params.applicationName;
  const featureName = req.params.featureName;
  const newFeatureDescription = req.body.newFeatureDescription;

  feature.updateFeatureDescription(applicationName, featureName, newFeatureDescription, req, (err) => {
    if (err) throw err;
    res.send(200);
  });
};

const updateFeatureToggle = (req, res) => {
  const applicationName = req.params.applicationName;
  const featureName = req.params.featureName;
  const value = req.body.value;

  feature.updateFeatureToggle(applicationName, featureName, value, req, (err) => {
    if (err) throw err;
    res.send(200);
  });
};

const addFeatureToggle = (req, res) => {
  const applicationName = req.params.applicationName;
  const featureName = req.params.featureName;
  const toggleName = req.body.toggleName;

  feature.addFeatureToggle(applicationName, featureName, toggleName, req, (err) => {
    if (err) throw err;
    res.send(200);
  });
};

const updateFeatureMultiToggle = function (req, res) {
  const applicationName = req.params.applicationName;
  const featureName = req.params.featureName;
  const toggleName = req.params.toggleName;
  const value = req.body.value;

  feature.updateFeatureMultiToggle(applicationName, featureName, toggleName, value, req, (err) => {
    if (err) throw err;
    res.send(200);
  });
};

const deleteFeature = (req, res) => {
  const applicationName = req.params.applicationName;
  const featureName = req.params.featureName;

  feature.deleteFeature(applicationName, featureName, req, (err) => {
    if (err) throw err;
    res.send(200);
  });
};


module.exports.registerRoutes = (app, authenticate, authorise) => {
  app.get('/api/applications/:applicationName', getFeatureCategories);
  app.get('/api/applications/:applicationName/:featureName', getFeature);
  app.post('/api/applications/:applicationName', authenticate, authorise, addFeature);
  app.put('/api/applications/:applicationName/:featureName', authenticate, authorise, updateFeatureToggle);
  app.patch('/api/applications/:applicationName/:featureName', authenticate, authorise, updateFeatureDescription);
  app.post('/api/applications/:applicationName/:featureName', authenticate, authorise, addFeatureToggle);
  app.put('/api/applications/:applicationName/:featureName/:toggleName', authenticate, authorise, updateFeatureMultiToggle);
  app.delete('/api/applications/:applicationName/:featureName', authenticate, authorise, deleteFeature);
};
