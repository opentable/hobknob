featureToggleFrontend.controller('DashboardController', function($scope, $http, etcdApiService, etcdPathService) {

    $scope.applicationList = {};
    $scope.selectedApplication = {};
    $scope.featureToggles = {};

    $scope.alerts = [];

    function getApplicationList() {
      etcdApiService.getApplications()
        .success(function (nodes) {
          $scope.applicationList = nodes;
          $scope.selectedApplication = nodes.node.nodes[0];
        })
        .error(function (error) {
          $scope.alerts.push({type: "danger", msg: "Unable to retrieve application list from etcd"});
        });
    }

    $scope.getTogglesForApplication = function() {
      if ($scope.selectedApplication) {
        etcdApiService.getToggles($scope.selectedApplication.key)
          .success(function (nodes) {
            $scope.featureToggles = nodes;
          })
          .error(function (error) {
            $scope.alerts.push({type: "danger", msg: "Unable to retrieve toggles for application"});
          });
      }
    }

    getApplicationList();
});