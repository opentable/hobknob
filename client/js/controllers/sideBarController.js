featureToggleFrontend.controller('SideBarController', function($scope, $http, etcdApiService, etcdPathService, AppsService, $timeout) {

    $scope.AppsService = AppsService;
    AppsService.loadApps()

});