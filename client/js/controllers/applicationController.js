featureToggleFrontend.controller('ApplicationController', function($scope, $http, etcdApiService, etcdPathService, AppsService, $timeout, $routeParams) {

    $scope.AppsService = AppsService;
    AppsService.loadApp($routeParams.appName);

    $scope.updateThisToggle = function(toggle) {
      $timeout(function(){
        AppsService.updateToggle(toggle);
      });
    }
});