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
                error();
            });
    };

    exports.addApplication = function (name) {
        var path = '/api/applications';
        return $http({
            method: 'PUT',
            url: path,
            data: { name: name },
            headers: {
                'Content-Type': 'application/json' // can default this once we stop calling etcd directly.
            }
        });
    };

    return exports;

}]);