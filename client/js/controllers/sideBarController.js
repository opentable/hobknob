featureToggleFrontend.controller('SideBarController', function($scope, $http, etcdApiService, etcdPathService, AppsService, $timeout, $location, CurrentUser) {

    $scope.AppsService = AppsService;
    $scope.CurrentUser = CurrentUser;

    (function refreshApps() {
    	AppsService.updateApps();

        $timeout(refreshApps, 3000);
    })();
    AppsService.loadApps();

    $scope.isActive = function(appName) {
    	return ($location.path() === '/applications/' + appName);
	}
});