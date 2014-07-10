'use strict';

angular.module('featureToggleFrontend').factory('etcdApiService', function($http, etcdPathService, ENV) {
	var etcdApiService = {}; 
	etcdApiService.getApplications = function() {
	    return $http.get(etcdPathService.getFullKeyPath(ENV.etcdVersion + '/toggles'));
	};

	etcdApiService.getToggles = function(key) {
		return $http.get(etcdPathService.getFullKeyPath(key));
	};

	return etcdApiService;
});