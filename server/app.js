var express = require("express"),
  exphbs  = require("express3-handlebars"),
  helpers = require("./src/helper"),
  app = express(),
  dashboardroutes = require("./routes/dashboardRoutes"),
  loadbalancerRoutes = require("./routes/loadbalancerRoutes"),
  authenticateroutes = require("./routes/authenticateRoutes"),
  path = require("path"),
  passport = require("passport"),
  googleStrategy = require('passport-google-oauth').OAuth2Strategy,
  config = require('./../config/default.json');

if (config.RequiresAuth) {
	if (config.AuthProviders.GoogleAuth) {
		var GOOGLE_CLIENT_ID = config.AuthProviders.GoogleAuth.GoogleClientId;
		var GOOGLE_CLIENT_SECRET = config.AuthProviders.GoogleAuth.GoogleClientSecret;
		var googleCallbackURL = (config.hobknobPort) ? "http://" + config.hobknobHost + ":" + config.hobknobPort + "/auth/google/callback" : "http://" + config.hobknobHost + "/auth/google/callback";

		passport.use(new googleStrategy({
			clientID: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
			callbackURL: googleCallbackURL
		},
		function(accessToken, refreshToken, profile, done){
			profile.accessToken = accessToken;
			//console.log(profile);
			process.nextTick(function(){
				return done(null, profile);
			});
		}));
	}
}

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated() || !config.RequiresAuth) { return next(); }
	res.redirect('/login');
}

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.set('views', __dirname + '/../client/views');
app.set("view engine", "jade");

app.set("port", process.env.PORT || 3006);

app.use(express.cookieParser("featuretoggle"));
app.use(express.session());
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.use(express.favicon());
app.use(express.logger("dev"));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

app.use(express.static(path.join(__dirname, '/../public')));
app.use('/bower_components',  express.static(path.join(__dirname, '/../public/bower_components')));

app.use(express.static(path.join(__dirname, "/../client")));
app.get('/login', authenticateroutes.login);
app.get("/", ensureAuthenticated, dashboardroutes.dashboard);
app.get('/partials/:name', dashboardroutes.partials);

app.get('/_lbstatus', loadbalancerRoutes.lbstatus);

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
});

app.get('/service-status', function(req, res) {
    res.status(200).end();
});

console.log("Starting up feature toggle dashboard on port " + app.get('port'));

app.listen(app.get("port"));
