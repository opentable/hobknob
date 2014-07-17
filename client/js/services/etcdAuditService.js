'use strict';

angular.module('featureToggleFrontend').factory('etcdAuditService', ['$http', 'etcdPathService', function($http, etcdPathService) {
	var etcdAuditService = {};

  	etcdAuditService.audit = function(audit) {

    	var auditKey = etcdPathService.make(['v1', 'toggleAudit', audit.applicationName, audit.toggleName]);
    	var auditUrl = etcdPathService.getFullKeyPath(auditKey);
    	return $http.post(auditUrl, "value=" + audit.toJSONString());
	};

	return etcdAuditService;
}]);