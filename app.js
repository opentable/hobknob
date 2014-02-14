var express = require('express'),
  exphbs  = require('express3-handlebars'),
  app = express(),
  routes = require('./routes');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(app.router);

app.get('/', routes.index);

console.log('Starting up feature toggle dashboard');

app.listen(3003);
