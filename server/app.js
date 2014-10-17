var express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    dashboardRoutes = require("./routes/dashboardRoutes"),
    loadBalancerRoutes = require("./routes/loadbalancerRoutes"),
    authenticateRoutes = require("./routes/authenticateRoutes"),
    applicationRoutes = require("./routes/applicationRoutes"),
    path = require("path"),
    acl = require("./acl"),
    config = require('./../config/default.json');

var passport = require("./auth").init(config);

app.set('views', __dirname + '/../client/views');
app.set("view engine", "jade");
app.set("port", process.env.PORT || 3006);

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(express.favicon());
app.use(express.logger("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.cookieParser("featuretoggle"));
app.use(require("./session").init(config, express));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

app.use(express.static(path.join(__dirname, '/../public')));
app.use('/bower_components',  express.static(path.join(__dirname, '/../public/bower_components')));

app.get('/_lbstatus', loadBalancerRoutes.lbstatus);
app.get('/service-status', function(req, res) {
  res.status(200).end();
});

var isAuthenticated = function(req) {
    return !config.RequiresAuth || req.isAuthenticated();
};

var ensureAuthenticatedOrRedirectToLogin = function(req, res, next) {
  if (isAuthenticated(req)) {
    return next();
  }
  res.redirect('/login');
};

var ensureAuthenticated = function(req, res, next) {
    if (isAuthenticated(req)) {
        return next();
    }
    res.send(403);
};

var authoriseUserForThisApplication = function(req, res, next) {
    if (!config.RequiresAuth) return true;

    var applicationName = req.params.applicationName;
    var userEmail = req.user._json.email;
    acl.assert(userEmail, applicationName, function(err, isAuthroised){
        if (err || !isAuthroised){
            res.send(403);
        } else {
            next();
        }
    });
};

app.use(express.static(path.join(__dirname, "/../client")));
app.get('/login', authenticateRoutes.login);
app.get("/", ensureAuthenticatedOrRedirectToLogin, dashboardRoutes.dashboard);
app.get('/partials/:name', dashboardRoutes.partials);
app.get('/logout', authenticateRoutes.logout);

app.get('/auth/google',
  passport.authenticate('google',
  {
      scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
  }),
  function(req, res){
    // The request will be redirected to Google for authentication
  }
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/oops' }),
  function(req, res) {
    res.redirect('/');
  }
);

app.get('/api/applications', applicationRoutes.getApplications);
app.get('/api/applications/:applicationName', applicationRoutes.getApplication);
app.put('/api/applications', ensureAuthenticated, applicationRoutes.addApplication);
app.put('/api/applications/:applicationName/:toggleName', ensureAuthenticated, authoriseUserForThisApplication, applicationRoutes.updateToggle);
app.get('/api/applications/:applicationName/:toggleName/audit', applicationRoutes.getAuditTrail);
app.post('/api/applications/:applicationName/:toggleName/audit', ensureAuthenticated, authoriseUserForThisApplication, applicationRoutes.addAudit);
app.post('/api/applications/:applicationName/users', ensureAuthenticated, authoriseUserForThisApplication, applicationRoutes.grant);
app.get('/api/applications/:applicationName/users', applicationRoutes.getUsers);
app.delete('/api/applications/:applicationName/users/:userEmail', ensureAuthenticated, authoriseUserForThisApplication, applicationRoutes.revoke);
app.get('/api/applications/:applicationName/users/:userEmail', applicationRoutes.assert);

console.log("Starting up feature toggle dashboard on port " + app.get('port'));

app.listen(app.get("port"));
