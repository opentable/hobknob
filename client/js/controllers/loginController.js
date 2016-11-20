featureToggleFrontend.controller('LoginController', ['$scope', '$window', 'ENV', ($scope, $window, ENV) => {
  if (ENV.RequiresAuth) {
    const authProvider = Object.keys(ENV.AuthProviders)[0];

    $scope.authProvider = authProvider;
  } else {
    $window.location.href = '/';
  }
}]);
