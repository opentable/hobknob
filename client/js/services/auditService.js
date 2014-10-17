'use strict';

angular.module('featureToggleFrontend')
    .factory('auditService', ['ENV', '$http', function(ENV, $http) {

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

    exports.addAudit = function(applicationName, toggleName, value, action, user, callback){
        var path = '/api/applications/' + applicationName + '/' + toggleName + '/audit';
        var audit = {
            applicationName: applicationName,
            toggleName: toggleName,
            value: value,
            action:action,
            user:user
        };

        $http({
            method: 'POST',
            url: path,
            data: { audit: audit },
            headers: {
                'Content-Type': 'application/json' // can default this once we stop calling etcd directly.
            }
        })
        .success(function(){
            callback();
        })
        .error(function(data){
            callback(data);
        });
    };

    return exports;

}]);