featureToggleFrontend.controller('ApplicationController', ['$scope', '$routeParams', 'toggleService', 'authorisationService', 'CurrentUser', function($scope, $routeParams, toggleService, authorisationService, CurrentUser) {

    $scope.applicationName = $routeParams.appName;
    $scope.requiresAuthentication = CurrentUser.requiresAuthentication();
    $scope.userHasPermissionsLoaded = false; // stops flickering of alert and buttons

    if ($scope.requiresAuthentication){
        authorisationService.isUserAuthorised($scope.applicationName, CurrentUser.email, function(err, isAuthorised){
            $scope.userHasPermissions = !err && isAuthorised;
            $scope.userHasPermissionsLoaded = true;
        });
    } else {
        $scope.userHasPermissions = true;
        $scope.userHasPermissionsLoaded = true;
    }

}]);