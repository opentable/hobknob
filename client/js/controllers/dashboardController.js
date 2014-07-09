featureToggleFrontend.controller('DashboardController', function($scope, $http, etcdApiService, etcdPathService) {

    $scope.applicationList;

    function getApplicationList() {
      etcdApiService.getApplications()
        .success(function (nodes) {
          console.log('Nodes: ' + nodes);
          $scope.applicationList = nodes;
        })
        .error(function (error) {
          console.log('error' + error);
           alert(error.message);
        });
    }
    getApplicationList();
});