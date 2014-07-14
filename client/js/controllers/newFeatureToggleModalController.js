featureToggleFrontend.controller('NewFeatureToggleModalController', ['$scope', '$modal', 'AppsService', function($scope, $modal, AppsService) {

  $scope.open = function () {
    $modal.open({
      templateUrl: 'createToggleContent.html',
      controller: ModalInstanceCtrl,
      resolve: {
        applicationName: function () {
          return AppsService.appName;
        }
      }
    });
  };
}]);

var ModalInstanceCtrl = ['$scope', '$modalInstance', 'etcdApiService', 'applicationName', function ($scope, $modalInstance, etcdApiService, applicationName) {

  $scope.alerts = [];
  $scope.form = {
    toggleName: null,
    applicationName: applicationName,
    created: false
  };

  $scope.ok = function () {
    $scope._clearAlerts();
    if (!$scope.form.applicationName || !$scope.form.toggleName){
      $scope.alerts.push({type: "danger", msg: "Please enter the application name and the feature toggle name"});
    } else {
      etcdApiService
        .create($scope.form.applicationName, $scope.form.toggleName)
        .success(function(){
          $scope.form.created = true;
          $scope.alerts.push({type: "success", msg: "Successfully created feature toggle" });
          $scope.$emit('toggle-added');
        })
        .error(function(){
          console.error("Error creating feature toggle", err); // todo: hook up angular logger
          $scope.alerts.push({type: "danger", msg: "Error saving feature toggle: " + err.data + ". Status: " + err.status});
        });
    }
  };

  $scope.$watch('form.toggleName', function(){
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

  $scope._clearAlerts = function() {
    if ($scope.alerts.length > 0){
      $scope.alerts.splice(0, $scope.alerts.length);
    }
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };
}];