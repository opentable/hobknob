featureToggleFrontend.controller('ApplicationDangerController', ['$scope', '$route', 'applicationService', '$location', ($scope, $route, applicationService, $location) => {
  $scope.confirm = false;

  $scope.deleteApplication = () => {
    const applicationName = $scope.applicationName;

    if (!$scope.confirm) {
      $scope.confirm = true;
      return;
    }

    applicationService.deleteApplication(applicationName, (err) => {
      if (err) {
        $scope.$emit('error', 'Failed to delete application. See console for more detail.', err);
        return;
      }

      $location.path('/');
    });
  };
}]);
