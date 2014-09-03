'use strict';

angular.module('featureToggleFrontend').factory('etcdAuditService', function($http, etcdPathService, etcdLeaderService) {
	var etcdAuditService = {};

  	etcdAuditService.audit = function(audit) {
  		audit.value = this.boolValue === true;
  		return etcdLeaderService.getLeader().success(function(leaderUri) {
  			var auditKey = etcdPathService.make(['v1', 'toggleAudit', audit.applicationName, audit.toggleName]);
  			var auditUrl = etcdPathService.makeLeaderPath(leaderUri, auditKey);

    		return $http.post(auditUrl, "value=" + audit.toJSONString());
  		});
	};

	return etcdAuditService;
});