angular.module('featureToggleFrontend').factory('toggleService', ['ENV', '$http', 'CurrentUser', 'auditService', function (ENV, $http, CurrentUser, auditService) {
  const exports = {};

  exports.getFeatureCategories = (applicationName, success, error) => {
    const path = `/api/applications/${applicationName}`;
    $http.get(path)
      .success((data) => {
        success(data.categories);
      })
      .error((data) => {
        error(data);
      });
  };

  exports.getFeature = (applicationName, featureName, success, error) => {
    const path = `api/applications/${applicationName}/${featureName}`;
    $http.get(path)
      .success((data) => {
        success(data);
      })
      .error((data) => {
        error(data);
      });
  };

  exports.addFeature = (applicationName, categoryId, featureName, featureDescription, success, error) => {
    const path = `/api/applications/${applicationName}`;
    $http.post(path, { featureName, featureDescription, categoryId })
      .success((data, status) => {
        success(status);
      })
      .error((data) => {
        error(data);
      });
  };

  exports.addFeatureToggle = (applicationName, featureName, toggleName, success, error) => {
    const path = `/api/applications/${applicationName}/${featureName}`;
    $http.post(path, { toggleName })
      .success((data, status) => {
        success(status);
      })
      .error((data) => {
        error(data);
      });
  };

  exports.updateFeatureToggle = (applicationName, featureName, isMultiToggle, toggleName, value, success, error) => {
    let path = `/api/applications/${applicationName}/${featureName}`;
    if (isMultiToggle) {
      path += `/${toggleName}`;
    }

    $http.put(path, { value })
      .success((data, status) => {
        if (success) success(status);
      })
      .error((data) => {
        if (error) error(data);
      });
  };

  exports.updateFeatureDescription = (applicationName, featureName, newFeatureDescription, success, error) => {
    const path = `/api/applications/${applicationName}/${featureName}`;
    $http({ method: 'PATCH', url: path, data: { newFeatureDescription } })
      .success((data, status) => {
        if (success) success(status);
      })
      .error((data) => {
        if (error) error(data);
      });
  };

  exports.deleteFeature = (applicationName, toggleName, callback) => {
    const path = `/api/applications/${applicationName}/${toggleName}`;
    $http.delete(path)
      .success(() => {
        callback();
      })
      .error((data) => {
        callback(new Error(data));
      });
  };

  return exports;
}]);
