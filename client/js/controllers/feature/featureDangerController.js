featureToggleFrontend.controller('FeaatureDangerController', ['$scope', 'toggleService', '$location', ($scope, toggleService, $location) => {
  $scope.confirm = false;

  $scope.deleteFeature = () => {
    const applicationName = $scope.applicationName;
    const featureName = $scope.featureName;

    if (!$scope.confirm) {
      $scope.confirm = true;
      return;
    }

    toggleService.deleteFeature(applicationName, featureName, (err) => {
      if (err) {
        $scope.$emit('error', 'Failed to delete feature. See console for more detail.', err);
        return;
      }
      $location.path(`/applications/${applicationName}`);
    });
  };
}]);
