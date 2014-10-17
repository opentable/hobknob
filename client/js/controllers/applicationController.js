featureToggleFrontend.controller('ApplicationController', ['$scope', '$routeParams', '$timeout', 'toggleService', 'authorisationService', 'focus', 'ENV', 'CurrentUser', function($scope, $routeParams, $timeout, toggleService, authorisationService, focus, ENV, CurrentUser) {

    $scope.applicationName = $routeParams.appName;
    $scope.requiresAuthentication = CurrentUser.requiresAuthentication();

    if ($scope.requiresAuthentication){
        authorisationService.isUserAuthorised($scope.applicationName, CurrentUser.email, function(err, isAuthorised){
            $scope.userHasPermissions = !err && isAuthorised;
        });
    } else {
        $scope.userHasPermissions = true;
    }

}]);