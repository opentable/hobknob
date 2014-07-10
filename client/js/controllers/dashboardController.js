featureToggleFrontend.controller('DashboardController', function($scope, $http, etcdApiService, etcdPathService) {

    $scope.applicationList = {};
    $scope.selectedApplication = {};
    $scope.featureToggles = {};

    function getApplicationList() {
      etcdApiService.getApplications()
        .success(function (nodes) {
          $scope.applicationList = nodes;
          $scope.selectedApplication = nodes.node.nodes[0];
        })
        .error(function (error) {
          console.log('error' + error);
          alert(error.message);
        });
    }

    $scope.getTogglesForApplication = function() {
      if ($scope.selectedApplication) {
        console.log('selected app: ' + $scope.selectedApplication);
        etcdApiService.getToggles($scope.selectedApplication.key)
          .success(function (nodes) {
            console.log('toggles: ' + JSON.stringify(nodes));
            $scope.featureToggles = nodes;
          })
          .error(function (error) {
            console.log('error' + error);
            alert(error.message);
          });
      }
    }
    
    getApplicationList();
});