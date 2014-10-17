angular.module('featureToggleFrontend').factory('auditService', ['ENV', '$http', function(ENV, $http) {
    'use strict';

    var exports = {};

    exports.getToggleAuditTrail = function(applicationName, toggleName, success, error){
        var path = '/api/applications/' + applicationName + '/' + toggleName + '/audit';
        $http.get(path)
            .success(function(data){
                success(data);
            })
            .error(function(data){
                error(data);
            });
    };

    // todo: this should be moved server side
    exports.addAudit = function(applicationName, toggleName, value, action, user, callback){
        var path = '/api/applications/' + applicationName + '/' + toggleName + '/audit';
        var audit = {
            applicationName: applicationName,
            toggleName: toggleName,
            value: value,
            action:action,
            user:user
        };

        $http.post(path,{ audit: audit })
            .success(function(){
                callback();
            })
            .error(function(data){
                callback(data);
            });
    };

    return exports;

}]);