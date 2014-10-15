'use strict';

angular.module('featureToggleFrontend')
    .factory('applicationService', ['ENV', '$http', function(ENV, $http) {

    var exports = {};

    exports.getApplications = function (success, error) {
        var path = '/api/applications';
        return $http.get(path)
            .success(function(data){
                success(data);
            })
            .error(function(){
                // todo: pass more here to error function
                error();
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
        .error(function(){
            // todo: pass more here to error function
            error();
        });
    };

    exports.getToggles = function (applicationName, success, error) {
        var path = '/api/applications/' + applicationName;
        $http.get(path)
        .success(function(data){
            success(data.toggles);
        })
        .error(function(){
            // todo: pass more here to error function
            error();
        });
    };

    exports.updateToggle = function (applicationName, toggleName, value, success, error) {
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
            success(status);
        })
        .error(function(){
            // todo: pass more here to error function
            error();
        });
    };

    return exports;

}]);