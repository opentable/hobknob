featureToggleFrontend.controller('DashboardController', function($scope, $http) {
    $scope.title = "test";
    $scope.username = "Ryan Tomlinson";
    $scope.pageHeader = "Test";
    $http({
      method: 'GET',
      url: '/features'
    }).
    success(function (data, status, headers, config) {
      $scope.featuretoggles = data;
    }).
    error(function (data, status, headers, config) {
      $scope.name = 'Error!';
    });
});