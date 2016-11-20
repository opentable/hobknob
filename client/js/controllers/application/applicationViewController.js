featureToggleFrontend.controller('ApplicationViewController', ['$scope', '$routeParams', 'toggleService', 'authorisationService', 'CurrentUser', ($scope, $routeParams, toggleService, authorisationService, CurrentUser) => {
  $scope.applicationName = $routeParams.applicationName;
  $scope.requiresAuthentication = CurrentUser.requiresAuthentication();
  $scope.userHasPermissionsLoaded = false; // stops flickering of alert and buttons

  if ($scope.requiresAuthentication) {
    authorisationService.isUserAuthorised($scope.applicationName, CurrentUser.getEmail(), (err, isAuthorised) => {
      $scope.userHasPermissions = !err && isAuthorised;
      $scope.userHasPermissionsLoaded = true;
    });
  } else {
    $scope.userHasPermissions = true;
    $scope.userHasPermissionsLoaded = true;
  }
}]);
