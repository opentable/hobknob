featureToggleFrontend.controller('DashboardController', function($scope, $http, etcdApiService, etcdPathService, AppsService, $timeout) {

    $scope.AppsService = AppsService;
    AppsService.loadApps()

    $scope.updateThisToggle = function(toggle) {
      $timeout(function(){
        AppsService.updateToggle(toggle);
      });
    }

});