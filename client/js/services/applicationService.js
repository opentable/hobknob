angular.module('featureToggleFrontend').factory('applicationService', ['$http', function ($http) {
  const exports = {};

  exports.getApplications = (success, error) => {
    const path = '/api/applications';
    return $http.get(path)
      .success((data) => {
        success(data);
      })
      .error((data) => {
        error(data);
      });
  };

  exports.addApplication = (name, success, error) => {
    const path = '/api/applications';
    $http.put(path, { name })
      .success((data, status) => {
        success(status);
      })
      .error((data) => {
        error(data);
      });
  };

  exports.deleteApplication = (name, cb) => {
    const path = `/api/applications/${name}`;
    $http.delete(path)
      .success((data, status) => {
        cb();
      })
      .error((data) => {
        cb(data);
      });
  };

  exports.getApplicationMetaData = (applicationName, cb) => {
    const path = `/api/applications/${applicationName}/_meta`;
    $http.get(path)
      .success((data, status) => {
        cb(null, data);
      })
      .error((data) => {
        cb(data);
      });
  };

  exports.saveApplicationMetaData = (applicationName, metaDataKey, metaDataValue, cb) => {
    const path = `/api/applications/${applicationName}/_meta/${metaDataKey}`;
    $http.put(path, { value: metaDataValue })
      .success(() => {
        cb();
      })
      .error((data) => {
        cb(data);
      });
  };

  return exports;
}]);
