featureToggleFrontend.controller('NewFeatureToggleModalController', ['$scope', '$modal', function($scope, $modal) {
  $scope.open = function () {
    $modal.open({
      templateUrl: 'createToggleContent.html',
      controller: ModalInstanceCtrl
    });
  };
}]);

var ModalInstanceCtrl = ['$scope', '$modalInstance', 'etcdApiService', function ($scope, $modalInstance, etcdApiService) {

  $scope.alerts = [];
  $scope.form = {
    name: null,
    applicationName: null,
    created: false
  };

  $scope._clearAlerts = function() {
    if ($scope.alerts.length > 0){
      $scope.alerts.splice(0, $scope.alerts.length);
    }
  };

  $scope.ok = function () {
    $scope._clearAlerts();
    if (!$scope.form.applicationName || !$scope.form.name){
      $scope.alerts.push({type: "danger", msg: "Please enter the application name and the feature toggle name"});
    } else {
      etcdApiService
        .create($scope.form.applicationName, $scope.form.name)
        .success(function(){
          $scope.form.created = true;
          $scope.alerts.push({type: "success", msg: "Successfully created feature toggle" });
        })
        .error(function(){
          console.error("Error creating feature toggle", err); // todo: hook up angular logger
          $scope.alerts.push({type: "danger", msg: "Error saving feature toggle: " + err.data + ". Status: " + err.status});
        });
    }
  };

  $scope.$watch('form.name', function(){
    $scope._clearAlerts();
  });

  $scope.$watch('form.applicationName', function(){
    $scope._clearAlerts();
  });

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.close = function () {
    $modalInstance.close();
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };
}];