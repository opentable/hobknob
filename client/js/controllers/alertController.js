featureToggleFrontend.controller('AlertController', ['$scope', '$rootScope', ($scope, $rootScope) => {
  $scope.alert = null;

  $rootScope.$on('success', (event, message) => {
    $scope.alert = {
      message,
      class: 'alert-success',
    };
  });

  $rootScope.$on('error', (event, message, err) => {
    $scope.alert = {
      message,
      class: 'alert-danger',
    };

    if (err) {
      console.log(err);
    }
  });

  $scope.$on('$locationChangeStart', () => {
    $scope.alert = null;
  });
}]);
