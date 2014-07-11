'use strict';

angular.module('featureToggleFrontend').factory('etcdApiService', function($http, etcdPathService, ENV) {
	var etcdApiService = {};

	etcdApiService.getApplications = function() {
	    return $http.get(etcdPathService.getFullKeyPath(ENV.etcdVersion + '/toggles'));
	};

	etcdApiService.getToggles = function(key) {
		return $http.get(etcdPathService.getFullKeyPath(key));
	};

  etcdApiService.create = function(applicationName, toggleName) {
    var featureTogglePath = etcdPathService.getFullKeyPath(ENV.etcdVersion + '/toggles/' + applicationName + "/" + toggleName);
    console.log(featureTogglePath);
    return $http.put(featureTogglePath, "value=false", {
      headers:{
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });
  };

	return etcdApiService;
});