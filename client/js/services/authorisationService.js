angular.module('featureToggleFrontend').factory('authorisationService', ['ENV', '$http', function (ENV, $http) {
  const exports = {};

  exports.getUsers = (applicationName, success, error) => {
    const path = `/api/applications/${applicationName}/users`;
    $http.get(path)
      .success((data) => {
        success(data);
      })
      .error((data) => {
        error(data);
      });
  };

  exports.grant = (applicationName, userEmail, success, error) => {
    const path = `/api/applications/${applicationName}/users`;
    $http.post(path, { userEmail })
      .success((data) => {
        success(data);
      })
      .error((data) => {
        error(data);
      });
  };

  exports.revoke = (applicationName, userEmail, success, error) => {
    const path = `/api/applications/${applicationName}/users/${userEmail}`;
    $http.delete(path)
      .success(() => {
        success();
      })
      .error((data) => {
        error(data);
      });
  };

  exports.isUserAuthorised = (applicationName, userEmail, callback) => {
    const path = `/api/applications/${applicationName}/users/${userEmail}`;
    $http.get(path)
      .success((data) => {
        callback(null, data.authorised);
      })
      .error((data) => {
        callback(new Error(data));
      });
  };

  return exports;
}]);
