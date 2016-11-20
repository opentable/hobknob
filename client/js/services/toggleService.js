'use strict';

angular.module('featureToggleFrontend').factory('toggleService', ['ENV', '$http', 'CurrentUser', 'auditService', function (ENV, $http, CurrentUser, auditService) {
  var exports = {};

  exports.getFeatureCategories = function (applicationName, success, error) {
    var path = '/api/applications/' + applicationName;
    $http.get(path)
      .success(function (data) {
        success(data.categories);
      })
      .error(function (data) {
        error(data);
      });
  };

  exports.getFeature = function (applicationName, featureName, success, error) {
    var path = 'api/applications/' + applicationName + '/' + featureName;
    $http.get(path)
      .success(function (data) {
        success(data);
      })
      .error(function (data) {
        error(data);
      });
  };

  exports.addFeature = function (applicationName, categoryId, featureName, featureDescription, success, error) {
    var path = '/api/applications/' + applicationName;
    $http.post(path, { featureName: featureName, featureDescription: featureDescription, categoryId: categoryId })
      .success(function (data, status) {
        success(status);
      })
      .error(function (data) {
        error(data);
      });
  };

  exports.addFeatureToggle = function (applicationName, featureName, toggleName, success, error) {
    var path = '/api/applications/' + applicationName + '/' + featureName;
    $http.post(path, { toggleName: toggleName })
      .success(function (data, status) {
        success(status);
      })
      .error(function (data) {
        error(data);
      });
  };

  exports.updateFeatureToggle = function (applicationName, featureName, isMultiToggle, toggleName, value, success, error) {
    var path = '/api/applications/' + applicationName + '/' + featureName + (isMultiToggle ? '/' + toggleName : '');
    $http.put(path, { value: value })
      .success(function (data, status) {
        if (success) success(status);
      })
      .error(function (data) {
        if (error) error(data);
      });
  };

  exports.updateFeatureDescription = function (applicationName, featureName, newFeatureDescription, success, error) {
    var path = '/api/applications/' + applicationName + '/' + featureName;
    $http({ method: 'PATCH', url: path, data: { newFeatureDescription: newFeatureDescription } })
      .success(function (data, status) {
        if (success) success(status);
      })
      .error(function (data) {
        if (error) error(data);
      });
  };

  exports.deleteFeature = function (applicationName, toggleName, callback) {
    var path = '/api/applications/' + applicationName + '/' + toggleName;
    $http.delete(path)
      .success(function () {
        callback();
      })
      .error(function (data) {
        callback(new Error(data));
      });
  };

  return exports;
}]);
