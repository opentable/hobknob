'use strict';

angular.module('featureToggleFrontend')
.factory('etcdPathService', function(ENV) {

  var etcdUrl = "http://" + ENV.etcdHost + ":" + ENV.etcdPort + '/' + ENV.etcdVersion,
      keyPrefix = etcdUrl + '/keys/';

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

    getFullKeyPath: function(key) {
      var path = keyPrefix + this.clean(key);
      
      if (path === keyPrefix.substring(0, keyPrefix.length - 1)) {
        return keyPrefix;
      }
      return path;
    }
  };

}); 