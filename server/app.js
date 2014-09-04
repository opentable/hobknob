var express = require("express"),
    exphbs  = require("express3-handlebars"),
    helpers = require("./src/helper"),
    app = express(),
    dashboardroutes = require("./routes/dashboardRoutes"),
    loadbalancerRoutes = require("./routes/loadbalancerRoutes"),
    authenticateroutes = require("./routes/authenticateRoutes"),
    path = require("path"),
    config = require('./../config/default.json');

var passport = require("./auth").init(config);

app.set('views', __dirname + '/../client/views');
app.set("view engine", "jade");
app.set("port", process.env.PORT || 3006);

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(express.favicon());
app.use(express.logger("dev"));

app.use(express.cookieParser("featuretoggle"));
app.use(require("./session").init(config));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

app.use(express.static(path.join(__dirname, '/../public')));
app.use('/bower_components',  express.static(path.join(__dirname, '/../public/bower_components')));

app.get('/_lbstatus', loadbalancerRoutes.lbstatus);
app.get('/service-status', function(req, res) {
  res.status(200).end();
});

var ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated() || !config.RequiresAuth) {
    return next();
  }
  res.redirect('/login');
};

app.use(express.static(path.join(__dirname, "/../client")));
app.get('/login', authenticateroutes.login);
app.get("/", ensureAuthenticated, dashboardroutes.dashboard);
app.get('/partials/:name', dashboardroutes.partials);

app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email'] }),
  function(req, res){
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
  }
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/oops' }),
  function(req, res) {
    res.redirect('/');
  }
);

console.log("Starting up feature toggle dashboard on port " + app.get('port'));

app.listen(app.get("port"));
