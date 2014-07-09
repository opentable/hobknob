'use strict';

angular.module('featureToggleFrontend').factory('etcdApiService', function($http, etcdPathService) {
	var etcdApiService = {}; 
	etcdApiService.getApplications = function() {
		console.log(etcdPathService.getFullKeyPath('featuretoggles'));
	    return $http.get(etcdPathService.getFullKeyPath('featuretoggles'));
	    // .then(function(resp) {
	    // 	return resp.data.node;
	    // });
	};

	return etcdApiService;
});