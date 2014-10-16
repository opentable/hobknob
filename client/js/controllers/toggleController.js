featureToggleFrontend.controller('ToggleController', ['$scope', '$routeParams', 'applicationService', function($scope, $routeParams, applicationService) {

    $scope.applicationName = $routeParams.appName;
    $scope.toggleName = $routeParams.toggleName;
    $scope.auditTrail = [];

    applicationService.getToggleAuditTrail($scope.applicationName, $scope.toggleName,
        function(data){
            $scope.auditTrail = data;
        },
        function(data, status, headers, config){
            // todo: do something with error
        });
}]);