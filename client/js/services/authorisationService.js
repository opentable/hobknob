'use strict';

angular.module('featureToggleFrontend')
    .factory('authorisationService', ['ENV', '$http', function(ENV, $http) {

    var exports = {};

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