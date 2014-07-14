'use strict';

angular.module('featureToggleFrontend').factory('etcdAuditService', ['$http', 'etcdPathService', function($http, etcdPathService) {
	var etcdAuditService = {};

  etcdAuditService.audit = function(applicationName, toggleName, action, value, user) {

    var auditKey = etcdPathService.make(['v1', 'toggleAudit', applicationName, toggleName]);
    var auditUrl = etcdPathService.getFullKeyPath(auditKey);
    var data = {
      value: value,
      user: user,
      dateModified: new Date().toString()
    };
    var dataString = JSON.stringify(data);
    return $http
      .post(auditUrl, "value=" + dataString, {
        headers:{
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });
	};

	return etcdAuditService;
}]);