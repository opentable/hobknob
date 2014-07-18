'use strict';

angular.module('featureToggleFrontend').factory('etcdApiService', function($http, etcdPathService, ENV, etcdAuditService, $q, Audit) {
	var etcdApiService = {};

	etcdApiService.getApplications = function() {
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

  var createAudit = function(audit){
    etcdAuditService
      .audit(audit)
      .catch(function(){
        console.log("Auditing failed for action: " + action + " on " + applicationName + "/" + toggleName);
        return
      })
  };

	etcdApiService.updateToggle = function(toggle) {
    var toggleUrl = etcdPathService.getFullKeyPath(toggle.key);
    return $http
      .put(toggleUrl, "value=" + toggle.boolValue)
      .success(function(){
        createAudit(Audit.updateAction(toggle, "AUser"))
      })
	};

  etcdApiService.create = function(applicationName, toggleName) {
    var toggleKey = etcdPathService.make(["v1", "toggles", applicationName, toggleName]),
        toggleUrl = etcdPathService.getFullKeyPath(toggleKey);

    return $http
      .put(toggleUrl, "value=false")
      .success(function(){
        createAudit(Audit.createAction(applicationName,toggleName,"AUser"))
      })
  };

	return etcdApiService;
});