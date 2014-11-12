featureToggleFrontend.controller('ToggleController', ['$scope', '$routeParams', function($scope, $routeParams) {

    $scope.applicationName = $routeParams.applicationName;
    $scope.featureName = $routeParams.featureName;

}]);