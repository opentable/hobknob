featureToggleFrontend.controller('DashboardController', function($scope, $http, etcdApiService, etcdPathService, $rootScope) {

    $scope.applicationList = {};
    $scope.selectedApplication = {};
    $scope.featureToggles = {};

    $scope.alerts = []



    function getApplicationList() {
      etcdApiService.getApplications()
        .success(function (nodes) {
          $scope.applicationList = nodes;
          $scope.selectedApplication = nodes.node.nodes[0];
        })
        .error(function (error) {
          console.log('error getting app');
          $scope.alerts.push({type: "danger", msg: "Unable to retrieve application list from etcd"});
        });
    }

    $scope.getTogglesForApplication = function() {
      if ($scope.selectedApplication) {
        var applicationName = etcdPathService.tail($scope.selectedApplication.key);
        $scope.$emit('selected-application-changed', applicationName);
        etcdApiService.getToggles($scope.selectedApplication.key)
          .success(function (nodes) {
            $scope.featureToggles = nodes;
          })
          .error(function (error) {
            $scope.alerts.push({type: "danger", msg: "Unable to retrieve toggles for application"});
          });
      }
    };

    $rootScope.$on('toggle-added', function() {
      $scope.getTogglesForApplication();
    });

    getApplicationList();
});