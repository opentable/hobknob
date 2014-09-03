'use strict';

angular.module('featureToggleFrontend')
.factory('etcdPathService', function(ENV) {

  var etcdUrl = "http://" + ENV.etcdHost + ":" + ENV.etcdPort + '/' + ENV.etcdCoreVersion,
      keyPrefix = etcdUrl + '/keys/',
      leader = etcdUrl + '/leader';

  return {

    clean: function(path) {
      var parts = this.explode(path);
      if (parts.length === 0) {
        return '';
      }
      return parts.join('/');
    },

    make: function(arr) {
      return '/' + arr.join('/');
    },

    explode: function(str) {
      var parts = str.split('/');
      parts = parts.filter(function(v) {
        return v !== '';
      });
      return parts;
    },

    getLeaderPath: function() {
      return leader;
    },

    makeLeaderPath: function(leader, toggleKey) {
      var hostname = leader.substring(0, leader.lastIndexOf(':'));
      var path = hostname + ':' + ENV.etcdPort + '/' + ENV.etcdCoreVersion + '/keys/' + this.clean(toggleKey);
      return path;     
    },

    getFullKeyPath: function(key) {
      var path = keyPrefix + this.clean(key);
      
      if (path === keyPrefix.substring(0, keyPrefix.length - 1)) {
        return keyPrefix;
      }
      return path;
    }
  };

}); 