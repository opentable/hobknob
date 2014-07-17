featureToggleFrontend.controller('ToggleController', function($scope, $http, etcdApiService, etcdPathService, AppsService, $timeout, $routeParams) {

    $scope.AppsService = AppsService;
    AppsService.loadToggle($routeParams.appName, $routeParams.toggleName).success(function(data) {
    	console.log(data);
    });
});