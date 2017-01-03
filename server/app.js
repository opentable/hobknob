const express = require('express');
const bodyParser = require('body-parser');
const dashboardRoutes = require('./routes/dashboardRoutes');
const loadBalancerRoutes = require('./routes/loadbalancerRoutes');
const authenticateRoutes = require('./routes/authenticateRoutes');
const authorisationRoutes = require('./routes/authorisationRoutes');
const auditRoutes = require('./routes/auditRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const featureRoutes = require('./routes/featureRoutes');
const path = require('path');
const acl = require('./domain/acl');
const config = require('config');
const _ = require('underscore');
const passport = require('./auth').init(config);

const app = express();

app.set('views', path.join(__dirname, '/../client/views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 3006);

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(express.favicon());

if (config.loggingMiddleware && config.loggingMiddleware.path) {
  app.use(require(config.loggingMiddleware.path)(config.loggingMiddleware.settings));
} else {
  app.use(express.logger('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.cookieParser('featuretoggle'));
app.use(require('./session').init(config, express));

app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

app.use(express.static(path.join(__dirname, '/../public')));
app.use('/bower_components', express.static(path.join(__dirname, '/../public/bower_components')));

app.get('/_lbstatus', loadBalancerRoutes.lbstatus);
app.get('/service-status', (req, res) => {
  res.status(200).end();
});

const isAuthenticated = function (req) {
  return !config.RequiresAuth || req.isAuthenticated();
};

const ensureAuthenticatedOrRedirectToLogin = function (req, res, next) {
  if (isAuthenticated(req)) {
    return next();
  }
  return res.redirect('/login');
};

const ensureAuthenticated = function (req, res, next) {
  if (isAuthenticated(req)) {
    return next();
  }
  return res.send(403);
};

const authoriseUserForThisApplication = function (req, res, next) {
  if (!config.RequiresAuth) {
    next();
    return;
  }

  const applicationName = req.params.applicationName;
  const userEmail = req.user._json.email; // eslint-disable-line no-underscore-dangle

  acl.assert(userEmail, applicationName, (err, isAuthorised) => {
    if (err || !isAuthorised) {
      res.send(403);
    } else {
      next();
    }
  });
};

const passportGoogleAuthenticateParams = function () {
  const defaultParams = {
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
  };

  const conf = (config.AuthProviders && config.AuthProviders.GoogleAuth && config.AuthProviders.GoogleAuth.authentication) || {};

  return _.extend(defaultParams, conf);
};


app.use(express.static(path.join(__dirname, '/../client')));
app.get('/login', authenticateRoutes.login);
app.get('/', ensureAuthenticatedOrRedirectToLogin, dashboardRoutes.dashboard);
app.get('/partials/:name', dashboardRoutes.partials);
app.get('/logout', authenticateRoutes.logout);

app.get('/auth/google',
  passport.authenticate('google', passportGoogleAuthenticateParams()),
  (req, res) => {
    // The request will be redirected to Google for authentication
  }
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/oops', failureFlash: true }),
  (req, res) => {
    res.redirect('/#!/');
  }
);

app.get('/auth/azureadoauth2',
  passport.authenticate('azure')
);

app.get('/auth/azureadoauth2/callback',
  passport.authenticate('azure', { failureRedirect: '/oops', failureFlash: true }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

if (config.plugin && config.plugin.path) {
  require(config.plugin.path)(app);
}

app.post('/api/applications/:applicationName/users', ensureAuthenticated, authoriseUserForThisApplication, authorisationRoutes.grant);
app.get('/api/applications/:applicationName/users', authorisationRoutes.getUsers);
app.delete('/api/applications/:applicationName/users/:userEmail', ensureAuthenticated, authoriseUserForThisApplication, authorisationRoutes.revoke);
app.get('/api/applications/:applicationName/users/:userEmail', authorisationRoutes.assert);

applicationRoutes.registerRoutes(app, ensureAuthenticated);
featureRoutes.registerRoutes(app, ensureAuthenticated, authoriseUserForThisApplication);

app.get('/api/audit/feature/:applicationName/:featureName', auditRoutes.getFeatureAuditTrail);
app.get('/api/audit/application/:applicationName', auditRoutes.getApplicationAuditTrail);

console.log(`Starting up feature toggle dashboard on port ${app.get('port')}`);

app.listen(app.get('port'));
