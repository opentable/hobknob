var path = require('path');
var async = require('async');

var config = require('../../../config/config.json');
var builtInHooks = [
  './server/src/hooks/audit.js',
  //'./server/src/hooks/auditReplication.js'
];
var customHooks = config.hooks || [];

var hooks = builtInHooks.concat(customHooks).map(function(hook){
  var hookpath = path.resolve(hook);
  try {
    return require(hookpath);
  }
  catch(error){
    console.log('Error loading hook: ' + hookpath);
  }
});

module.exports.run = function(ev){
  async.each(hooks, function(hook, done){
    if(hook[ev.fn]){
      return hook[ev.fn](ev, done);
    }
    done();
  }, function(err){
    if(err){
      console.log(err);
    }
  });
};
