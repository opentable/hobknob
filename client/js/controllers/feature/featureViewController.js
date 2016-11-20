featureToggleFrontend.controller('FeatureViewController', ['$scope', '$routeParams', ($scope, $routeParams) => {
  $scope.applicationName = $routeParams.applicationName;
  $scope.featureName = $routeParams.featureName;
}]);
