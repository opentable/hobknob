featureToggleFrontend.controller('SideBarController', function($scope, $http, etcdApiService, etcdPathService, AppsService, $timeout, $location) {

    $scope.AppsService = AppsService;
    AppsService.loadApps();

    $scope.isActive = function(appName) {
    	return ($location.path() === '/applications/' + appName);
	}
});