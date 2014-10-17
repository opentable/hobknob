'use strict';

angular.module('featureToggleFrontend')
    .factory('toggleService', ['ENV', '$http', 'CurrentUser', 'auditService', function(ENV, $http, CurrentUser, auditService) {

    var exports = {};

    exports.getApplications = function (success, error) {
        var path = '/api/applications';
        return $http.get(path)
            .success(function(data){
                success(data);
            })
            .error(function(data){
                error(data);
            });
    };

    exports.addApplication = function (name, success, error) {
        var path = '/api/applications';
        $http({
            method: 'PUT',
            url: path,
            data: { name: name },
            headers: {
                'Content-Type': 'application/json' // can default this once we stop calling etcd directly.
            }
        })
        .success(function(data, status){
            success(status);
        })
        .error(function(data){
            error(data);
        });
    };

    exports.getToggles = function (applicationName, success, error) {
        var path = '/api/applications/' + applicationName;
        $http.get(path)
        .success(function(data){
            success(data.toggles);
        })
        .error(function(data){
            error(data);
        });
    };

    exports.addToggle = function (applicationName, toggleName, value, success, error) {
        addOrUpdateToggle(applicationName, toggleName, value, 'Created', success, error);
    };

    exports.updateToggle = function (applicationName, toggleName, value, success, error) {
        addOrUpdateToggle(applicationName, toggleName, value, 'Updated', success, error);
    };

    var addOrUpdateToggle = function (applicationName, toggleName, value, auditAction, success, error) {
        var path = '/api/applications/' + applicationName + '/' + toggleName;
        $http({
            method: 'PUT',
            url: path,
            data: { value: value },
            headers: {
                'Content-Type': 'application/json' // can default this once we stop calling etcd directly.
            }
        })
        .success(function(data, status){
                auditService.addAudit(applicationName, toggleName, value, auditAction,  CurrentUser.getFullName(), function(err){
                if (err){
                    console.log(err);
                }
            });
            success(status);
        })
        .error(function(data){
            error(data);
        });
    };

    return exports;

}]);