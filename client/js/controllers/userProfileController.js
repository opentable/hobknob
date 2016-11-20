featureToggleFrontend.controller('UserProfileController', ['$scope', 'CurrentUser', ($scope, CurrentUser) => {
  $scope.currentUser = CurrentUser;
}]);
