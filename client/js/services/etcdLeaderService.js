'use strict';

angular.module('featureToggleFrontend').factory('etcdLeaderService', ['$http', 'etcdPathService', function($http, etcdPathService) {
	var etcdLeaderService = {};

  	etcdLeaderService.getLeader = function(audit) {
		return $http.get(etcdPathService.getLeaderPath());
	};

	return etcdLeaderService;
}]);