var application = require('./../domain/application');

var getApplications = function(req, res){
    application.getApplications(
        function(err, applications){
            if (err) throw err;
            res.send(applications);
        });
};

var addApplication = function(req, res){
    application.addApplication(req.body.name, req,
        function(err){
            if (err) throw err;
            res.send(201);
        });
};

module.exports.registerRoutes = function(app, authenticate){
    app.get('/api/applications', getApplications);
    app.put('/api/applications', authenticate, addApplication);
};