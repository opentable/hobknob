'use strict';

var path = require('path');
var async = require('async');
var TIMEOUT = 5 * 1000;

var config = require('../../../config/config.json');
var builtInHooks = [
  './server/src/hooks/audit.js'
];
var customHooks = config.hooks || [];

var hooks = builtInHooks.concat(customHooks).map(function (hook) {
  var hookpath = path.resolve(hook);
  try {
    return require(hookpath);
  }
  catch (error) {
    console.log('Error loading hook: ' + hookpath);
  }
});

module.exports.run = function (ev) {
  async.each(hooks, function (hook, done) {
    if (hook[ev.fn]) {
      var fn = async.timeout(hook[ev.fn], TIMEOUT);
      return fn(ev, done);
    }
    done();
  }, function(err) {
    if (err) {
      console.log(err);
    }
  });
};
