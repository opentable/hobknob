featureToggleFrontend.controller('FeatureAuditController', ['$scope', 'auditService', 'CurrentUser', function ($scope, auditService, CurrentUser) {
  $scope.auditTrail = [];

  const addFakeAudit = (toggleName, value, action, isMultiToggle) => {
    const newCreatedIndex = $scope.auditTrail ? _.max($scope.auditTrail, audit => audit.createdIndex).createdIndex + 1 : 1;

    const fakeAudit = {
      user: {
        name: CurrentUser.getFullName(),
      },
      toggleName: isMultiToggle ? toggleName : null,
      value,
      action,
      dateModified: moment().toISOString(),
      createdIndex: newCreatedIndex,
    };

    $scope.auditTrail.push(fakeAudit);
  };

  $scope.isObject = input => angular.isObject(input);

  $scope.$on('toggleUpdated', (event, toggle, isMultiToggle) => {
    addFakeAudit(toggle.name, toggle.value, 'Updated', isMultiToggle);
  });

  auditService.getFeatureAuditTrail($scope.applicationName, $scope.featureName,
    (data) => {
      $scope.auditTrail = data;
    },
    (data) => {
      $scope.$emit('error', 'Error loading audit trail', new Error(data));
    });
}]);
