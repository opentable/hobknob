angular.module('featureToggleFrontend').factory('auditService', ['ENV', '$http', function(ENV, $http) {
    'use strict';

    var exports = {};

    exports.getToggleAuditTrail = function(applicationName, toggleName, success, error){
        var path = '/api/audit/toggle/' + applicationName + '/' + toggleName;
        $http.get(path)
            .success(function(data){
                success(data);
            })
            .error(function(data){
                error(data);
            });
    };

    exports.getApplicationAuditTrail = function(applicationName, success, error){
        var path = '/api/audit/application/' + applicationName;
        $http.get(path)
            .success(function(data){
                success(data);
            })
            .error(function(data){
                error(data);
            });
    };

    return exports;

}]);