angular.module('featureToggleFrontend').factory('auditService', ['ENV', '$http', function (ENV, $http) {
  const exports = {};

  exports.getFeatureAuditTrail = (applicationName, featureName, success, error) => {
    const path = `/api/audit/feature/${applicationName}/${featureName}`;
    $http.get(path)
      .success((data) => {
        success(data);
      })
      .error((data) => {
        error(data);
      });
  };

  exports.getApplicationAuditTrail = (applicationName, success, error) => {
    const path = `/api/audit/application/${applicationName}`;
    $http.get(path)
      .success((data) => {
        success(data);
      })
      .error((data) => {
        error(data);
      });
  };

  return exports;
}]);
