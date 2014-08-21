featureToggleFrontend.controller('SideBarController', function($scope, $http, etcdApiService, etcdPathService, AppsService, $timeout, $location, CurrentUser) {

    $scope.AppsService = AppsService;
    $scope.CurrentUser = CurrentUser;
    AppsService.loadApps();

    $scope.isActive = function(appName) {
    	return ($location.path() === '/applications/' + appName);
	}
});