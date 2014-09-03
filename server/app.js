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

app.use(express.cookieParser("featuretoggle"));

var sessionMiddleware = require("./session").init(config);

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.use(express.favicon());
app.use(express.logger("dev"));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

app.use(express.static(path.join(__dirname, '/../public')));
app.use('/bower_components',  express.static(path.join(__dirname, '/../public/bower_components')));

var ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated() || !config.RequiresAuth) { return next(); }
  res.redirect('/login');
}

app.use(express.static(path.join(__dirname, "/../client")));
app.get('/login', sessionMiddleware, authenticateroutes.login);
app.get("/", [ ensureAuthenticated, sessionMiddleware ], dashboardroutes.dashboard);
app.get('/partials/:name', sessionMiddleware, dashboardroutes.partials);

app.get('/_lbstatus', loadbalancerRoutes.lbstatus);

app.get('/auth/google',
	[ passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile',
                                'https://www.googleapis.com/auth/userinfo.email'] }), sessionMiddleware ],
	function(req, res){
	// The request will be redirected to Google for authentication, so this
	// function will not be called.
	}
);

app.get('/auth/google/callback',
	[ passport.authenticate('google', { failureRedirect: '/oops' }), sessionMiddleware ],
	function(req, res) {
	res.redirect('/');
});

app.get('/service-status', function(req, res) {
    res.status(200).end();
});

console.log("Starting up feature toggle dashboard on port " + app.get('port'));

app.listen(app.get("port"));
