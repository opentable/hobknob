featureToggleFrontend.controller('ToggleModalController', function($scope, $modal) {
    $scope.open = function () {

    var modalInstance = $modal.open({
      templateUrl: 'createToggleContent.html',
      controller: ModalInstanceCtrl
    });
  };
});

var ModalInstanceCtrl = function ($scope, $modalInstance) {

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};