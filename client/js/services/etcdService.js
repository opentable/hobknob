'use strict';

angular.module('featureToggleFrontend').factory('etcdApiService', function($http, etcdPathService, ENV, etcdAuditService, $q) {
	var etcdApiService = {};

	etcdApiService.getApplications = function() {
	    return $http.get(etcdPathService.getFullKeyPath('/v1/toggles'));
	};

	etcdApiService.getApplication = function(appName) {
	    return $http.get(etcdPathService.getFullKeyPath('/v1/toggles/' + appName));
	};

	etcdApiService.getToggles = function(key) {
		return $http.get(etcdPathService.getFullKeyPath(key));
	};

  var auditAndResolvePromise = function(deferred, applicationName, toggleName, action, value, user){
    etcdAuditService
      .audit(applicationName, toggleName, action, value, user)
      .success(function(){
        deferred.resolve();
      })
      .error(function(){
        console.log("Auditing failed for action: " + action + " on " + applicationName + "/" + toggleName);
        deferred.resolve();
      });
  }

	etcdApiService.updateToggle = function(toggle) {
    var deferred = $q.defer(),
        toggleUrl = etcdPathService.getFullKeyPath(toggle.key);

		$http
      .put(toggleUrl,
        "value=" + toggle.boolValue,
        { headers:{ "Content-Type": "application/x-www-form-urlencoded" } })
      .success(function(){
        auditAndResolvePromise(deferred, toggle.applicationName, toggle.toggleName, "update", toggle.value, "AUser");
      })
      .error(function(err){
        deferred.reject(err);
      });

    return deferred.promise;
	};

  etcdApiService.create = function(applicationName, toggleName) {
    var deferred = $q.defer(),
        toggleKey = etcdPathService.make(["v1", "toggles", applicationName, toggleName]),
        toggleUrl = etcdPathService.getFullKeyPath(toggleKey);

    $http
      .put(toggleUrl,
        "value=false",
        { headers:{ "Content-Type": "application/x-www-form-urlencoded" } })
      .success(function(){
        auditAndResolvePromise(deferred, applicationName, toggleName, "create", "false", "AUser");
      })
      .error(function(err){
        deferred.reject(err);
      });

    return deferred.promise;
  };

	return etcdApiService;
});