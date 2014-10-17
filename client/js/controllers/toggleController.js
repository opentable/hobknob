featureToggleFrontend.controller('ToggleController', ['$scope', '$routeParams', function($scope, $routeParams) {

    $scope.applicationName = $routeParams.appName;
    $scope.toggleName = $routeParams.toggleName;

}]);