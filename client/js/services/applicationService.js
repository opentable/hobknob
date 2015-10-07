angular.module('featureToggleFrontend').factory('applicationService', ['$http', function ($http) {
    'use strict';

    var exports = {};

    exports.getApplications = function (success, error) {
        var path = '/api/applications';
        return $http.get(path)
            .success(function (data) {
                success(data);
            })
            .error(function (data) {
                error(data);
            });
    };

    exports.addApplication = function (name, success, error) {
        var path = '/api/applications';
        $http.put(path, {name: name})
            .success(function (data, status) {
                success(status);
            })
            .error(function (data) {
                error(data);
            });
    };

    exports.getApplicationMetaData = function (applicationName, cb) {
        var path = '/api/applications/' + applicationName + '/_meta';
        $http.get(path)
            .success(function (data, status) {
                cb(null, data);
            })
            .error(function (data) {
                cb(data);
            });
    };

    exports.saveApplicationMetaData = function (applicationName, metaDataKey, metaDataValue, cb) {
        var path = '/api/applications/' + applicationName + '/_meta/' + metaDataKey;
        $http.put(path, {value: metaDataValue})
            .success(function () {
                cb();
            })
            .error(function (data) {
                cb(data);
            });
    };

    return exports;
}]);
