featureToggleFrontend.controller('ApplicationController', function($scope, $http, etcdApiService, etcdPathService, AppsService, $timeout, $routeParams) {

    $scope.AppsService = AppsService;

    var refreshToggles = function() {
        AppsService.updateToggles();

        refreshTimer = $timeout(refreshToggles, 3000);
    }

    var refreshTimer = $timeout(refreshToggles, 3000);

    AppsService.loadApp($routeParams.appName);

    $scope.updateThisToggle = function(toggle) {
        $timeout(function(){
            AppsService.updateToggle(toggle);
        });
    }

    $scope.$on("$destroy", function() {
        if (refreshTimer) {
            $timeout.cancel(refreshTimer);
        }
    });
});