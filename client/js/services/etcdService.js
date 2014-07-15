'use strict';

angular.module('featureToggleFrontend').factory('etcdApiService', function($http, etcdPathService, ENV, etcdAuditService, $q) {
	var etcdApiService = {};

	etcdApiService.getApplications = function() {
      console.log(etcdPathService.getFullKeyPath('/v1/toggles'));
	    return $http.get(etcdPathService.getFullKeyPath('/v1/toggles'));
	};

	etcdApiService.getApplication = function(applicationName) {
    var applicationKey = etcdPathService.make(["v1", "toggles", applicationName]);
    return $http.get(etcdPathService.getFullKeyPath(applicationKey));
	};

	etcdApiService.getToggles = function(key) {
		return $http.get(etcdPathService.getFullKeyPath(key));
	};

  etcdApiService.getToggle = function(applicationName, toggleName) {
    var togglePath = etcdPathService.make(["v1", "toggles", applicationName, toggleName]);
    return $http.get(etcdPathService.getFullKeyPath(togglePath));
  };

  etcdApiService.getToggleAudit = function(applicationName, toggleName) {
    var togglePath = etcdPathService.make(["v1", "toggleAudit", applicationName, toggleName]);
    return $http.get(etcdPathService.getFullKeyPath(togglePath) + "?recursive=true");
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
  };

	etcdApiService.updateToggle = function(toggle) {
    var deferred = $q.defer(),
        toggleUrl = etcdPathService.getFullKeyPath(toggle.key);

    $http
      .put(toggleUrl, "value=" + toggle.boolValue)
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
      .put(toggleUrl, "value=false")
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