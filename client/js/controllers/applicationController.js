featureToggleFrontend.controller('ApplicationController', function($scope, $http, etcdApiService, etcdPathService, AppsService, $timeout, $routeParams) {

    $scope.AppsService = AppsService;

    (function refreshToggles() {
    	AppsService.updateToggles();

        $timeout(refreshToggles, 3000);
    })();

    AppsService.loadApp($routeParams.appName);

    $scope.updateThisToggle = function(toggle) {
      $timeout(function(){
        AppsService.updateToggle(toggle);
      });
    }
});