'use strict';

angular.module('featureToggleFrontend').factory('etcdApiService', function($http, etcdPathService, ENV) {
	var etcdApiService = {};

	etcdApiService.getApplications = function() {
	    return $http.get(etcdPathService.getFullKeyPath('/v1/toggles'));
	};

	etcdApiService.getToggles = function(key) {
		return $http.get(etcdPathService.getFullKeyPath(key));
	};

	etcdApiService.updateToggle = function(toggle) {
		return $http.put(etcdPathService.getFullKeyPath(toggle.key), "value=" + toggle.boolValue, {
      		headers:{
          		"Content-Type": "application/x-www-form-urlencoded"
        	}
     	});
	};

  etcdApiService.create = function(applicationName, toggleName) {
    var toggleKey = etcdPathService.make(["v1", "toggles", applicationName, toggleName]);
    var toggleUrl = etcdPathService.getFullKeyPath(toggleKey);

    return $http.put(toggleUrl, "value=false", {
        headers:{
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });
  };

	return etcdApiService;
});