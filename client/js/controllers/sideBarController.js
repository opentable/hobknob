featureToggleFrontend.controller('SideBarController', function($scope, $http, etcdApiService, etcdPathService, AppsService, $timeout, $location, CurrentUser) {

    $scope.AppsService = AppsService;
    $scope.CurrentUser = CurrentUser;

    var refreshApps = function() {
    	AppsService.updateApps();

        refreshTimer = $timeout(refreshApps, 3000);
    }

	var refreshTimer = $timeout(refreshApps, 3000);

    AppsService.loadApps();

    $scope.isActive = function(appName) {
    	return ($location.path() === '/applications/' + appName);
	}

	$scope.$on("$destroy", function() {
        if (refreshTimer) {
            $timeout.cancel(refreshTimer);
        }
    });
});