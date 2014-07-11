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

  etcdApiService.create = function(applicationName, toggleName, callback) {
    var featureTogglePath = etcdPathService.getFullKeyPath("featuretoggles/" + applicationName + "/" + toggleName);
    console.log(featureTogglePath);
    return $http.put(featureTogglePath, {value: "false"})
      .success(function(){
        callback();
      })
      .error(function(err){
        callback(err);
      });
  };

	return etcdApiService;
});