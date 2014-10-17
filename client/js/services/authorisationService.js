

angular.module('featureToggleFrontend').factory('authorisationService', ['ENV', '$http', function(ENV, $http) {
    'use strict';

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
        $http.post(path, { user: user })
            .success(function(data){
                success(data);
            })
            .error(function(data){
                error(data);
            });
    };

    exports.revoke = function (applicationName, user, success, error) {
        var path = '/api/applications/' + applicationName + '/users/' + user;
        $http.delete(path)
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
            .success(function(data){
                callback(null, data.authorised);
            })
            .error(function(data){
                callback(new Error(data));
            });
    };

    return exports;

}]);