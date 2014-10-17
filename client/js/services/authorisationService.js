

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

    exports.grant = function (applicationName, userEmail, success, error) {
        var path = '/api/applications/' + applicationName + '/users';
        $http.post(path, { userEmail: userEmail })
            .success(function(data){
                success(data);
            })
            .error(function(data){
                error(data);
            });
    };

    exports.revoke = function (applicationName, userEmail, success, error) {
        var path = '/api/applications/' + applicationName + '/users/' + userEmail;
        $http.delete(path)
            .success(function(){
                success();
            })
            .error(function(data){
                error(data);
            });
    };

    exports.isUserAuthorised = function (applicationName, userEmail, callback) {
        var path = '/api/applications/' + applicationName + '/users/' + userEmail;
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