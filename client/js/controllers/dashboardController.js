featureToggleFrontend.controller('DashboardController', function($scope, $http, etcdApiService, etcdPathService, AppsService) {

    $scope.AppsService = AppsService;
    AppsService.loadApps()

});