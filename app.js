var express = require('express'),
  exphbs  = require('express3-handlebars'),
  app = express(),
  dashboardroutes = require('./routes'),
  authenticateroutes = require('./routes/authenticate'),
  path = require('path');

var authenticationChecker = function(req, res, next) { 
  if (req.session.user && req.session.user.isAuthenticated) {
    next();   
  } else {
    res.redirect('/');   
  }
};

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.bodyParser());
app.use(express.cookieParser('featuretoggle'));
app.use(express.session());

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/dashboard', authenticationChecker, dashboardroutes.index);
app.get('/', authenticateroutes.authenticate);

app.post('/', authenticateroutes.login);

console.log('Starting up feature toggle dashboard');

app.listen(3006);
