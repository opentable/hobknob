'use strict';

angular.module('featureToggleFrontend')
    .factory('applicationService', ['ENV', '$http', 'CurrentUser', function(ENV, $http, CurrentUser) {

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
            addAudit(applicationName, toggleName, value, auditAction,  CurrentUser.getFullName(), function(err){
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

    var addAudit = function(applicationName, toggleName, value, action, user, callback){
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

    exports.getUsers = function (applicationName, success, error) {
        var path = '/api/applications/' + applicationName + '/users';
        $http.get(path)
            .success(function(data){
                success(data);
            })
            .error(function(data){
                error(data);
            });
    };

    exports.grant = function (applicationName, user, success, error) {
        var path = '/api/applications/' + applicationName + '/users';
        $http({
            method: 'POST',
            url: path,
            data: { user: user },
            headers: {
                'Content-Type': 'application/json' // can default this once we stop calling etcd directly.
            }
        })
        .success(function(data){
            success(data);
        })
        .error(function(data){
            error(data);
        });
    };

    exports.revoke = function (applicationName, user, success, error) {
        var path = '/api/applications/' + applicationName + '/users/' + user;
        $http({
            method: 'DELETE',
            url: path
        })
        .success(function(){
            success();
        })
        .error(function(data){
            error(data);
        });
    };

    exports.isUserAuthorised = function (applicationName, user, callback) {
        var path = '/api/applications/' + applicationName + '/users/' + user;
        $http.get(path)
            .success(function(isAuthorised){
                callback(null, isAuthorised);
            })
            .error(function(data){
                // todo: pass more here to error function
                callback(new Error(data));
            });
    };

    return exports;

}]);