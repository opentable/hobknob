'use strict';

featureToggleFrontend.controller('UserProfileController', ['$scope', 'CurrentUser', function ($scope, CurrentUser) {
    $scope.currentUser = CurrentUser;
}]);
