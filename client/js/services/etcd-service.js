'use strict';

angular.module('featureToggleFrontend').factory('etcdApiService', function($http, etcdPathService) {
	var etcdApiService = {}; 
	etcdApiService.getApplications = function() {
	    return $http.get(etcdPathService.getFullKeyPath('featuretoggles'));
	};

	etcdApiService.getToggles = function(key) {
		return $http.get(etcdPathService.getFullKeyPath(key));
	};

	return etcdApiService;
});