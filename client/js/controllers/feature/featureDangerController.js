'use strict';

featureToggleFrontend.controller('FeaatureDangerController', ['$scope', 'toggleService', '$location', function ($scope, toggleService, $location) {
  $scope.confirm = false;

  $scope.deleteFeature = function () {
    var applicationName = $scope.applicationName;
    var featureName = $scope.featureName;

    if (!$scope.confirm) {
      $scope.confirm = true;
      return;
    }

    toggleService.deleteFeature(applicationName, featureName, function (err) {
      if (err) {
        $scope.$emit('error', 'Failed to delete feature. See console for more detail.', err);
        return;
      }
      $location.path('/applications/' + applicationName);
    });
  };
}]);
