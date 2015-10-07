'use strict';

angular.module('featureToggleFrontend').factory('auditService', ['ENV', '$http', function (ENV, $http) {
    var exports = {};

    exports.getFeatureAuditTrail = function (applicationName, featureName, success, error) {
        var path = '/api/audit/feature/' + applicationName + '/' + featureName;
        $http.get(path)
            .success(function (data) {
                success(data);
            })
            .error(function (data) {
                error(data);
            });
    };

    exports.getApplicationAuditTrail = function (applicationName, success, error) {
        var path = '/api/audit/application/' + applicationName;
        $http.get(path)
            .success(function (data) {
                success(data);
            })
            .error(function (data) {
                error(data);
            });
    };

    return exports;
}]);
