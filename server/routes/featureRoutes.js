var feature = require('./../domain/feature');

var getFeatureCategories = function(req, res){
    feature.getFeatureCategories(req.params.applicationName,
        function(err, application){
            if (err) throw err;

            if (application){
                res.send(application);
            } else {
                res.send(404);
            }
        });
};

var getFeature = function(req, res) {
    var applicationName = req.params.applicationName;
    var featureName = req.params.featureName;

    feature.getFeature(applicationName, featureName, function(err, feature){
        if (err) throw err;
        if (feature){
            res.send(feature);
        } else {
            res.send(404);
        }
    });
};

var addFeature = function(req, res){
    var applicationName = req.params.applicationName;
    var featureName = req.body.featureName;
    var featureDescription = req.body.featureDescription;
    var categoryId = req.body.categoryId;

    feature.addFeature(applicationName, featureName, featureDescription, categoryId, req, function(err){
        if (err) throw err;
        res.send(201);
    });
};

var updateFeature = function(req, res) {
    var applicationName = req.params.applicationName;
    var featureName = req.params.featureName;
    var newFeatureDescription = req.body.newFeatureDescription;

    feature.updateFeatureDescription(applicationName, featureName, newFeatureDescription, req, function(err){
        if (err) throw err;
        res.send(200);
    });
};

var updateFeatureToggle = function(req, res){
    var applicationName = req.params.applicationName;
    var featureName = req.params.featureName;
    var value = req.body.value;

    feature.updateFeatureToggle(applicationName, featureName, value, req, function(err){
        if (err) throw err;
        res.send(200);
    });
};

var addFeatureToggle = function(req, res){
    var applicationName = req.params.applicationName;
    var featureName = req.params.featureName;
    var toggleName = req.body.toggleName;

    feature.addFeatureToggle(applicationName, featureName, toggleName, req, function(err){
        if (err) throw err;
        res.send(200);
    });
};

var updateFeatureMultiToggle = function(req, res){
    var applicationName = req.params.applicationName;
    var featureName = req.params.featureName;
    var toggleName = req.params.toggleName;
    var value = req.body.value;

    feature.updateFeatureMultiToggle(applicationName, featureName, toggleName, value, req, function(err){
        if (err) throw err;
        res.send(200);
    });
};

var deleteFeature = function(req, res){
    var applicationName = req.params.applicationName;
    var featureName = req.params.featureName;

    feature.deleteFeature(applicationName, featureName, req, function(err){
        if (err) throw err;
        res.send(200);
    });
};


module.exports.registerRoutes = function(app, authenticate, authorise){
    app.get('/api/applications/:applicationName', getFeatureCategories);
    app.get('/api/applications/:applicationName/:featureName', getFeature);
    app.post('/api/applications/:applicationName', authenticate, authorise, addFeature);
    app.put('/api/applications/:applicationName/:featureName', authenticate, authorise, updateFeatureToggle);
    app.patch('/api/applications/:applicationName/:featureName', authenticate, authorise, updateFeature);
    app.post('/api/applications/:applicationName/:featureName', authenticate, authorise, addFeatureToggle);
    app.put('/api/applications/:applicationName/:featureName/:toggleName', authenticate, authorise, updateFeatureMultiToggle);
    app.delete('/api/applications/:applicationName/:featureName', authenticate, authorise, deleteFeature);
};