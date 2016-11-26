'use strict';
global.__base = __dirname;

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var middleware = require(__base + '/middleware');
var routing = require(__base + '/routing');

app.set('port', process.env.PORT || 3005);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(app.router);

middleware.configure(app);
routing.register(app);

var port = app.get('port');
console.log('Starting up Feature Toggle API on port ' + port);
app.listen(port);
