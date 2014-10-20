featureToggleFrontend.controller('ToggleAuditController', ['$scope', 'auditService', function($scope, auditService) {

    $scope.auditTrail = [];

    auditService.getToggleAuditTrail($scope.applicationName, $scope.toggleName,
        function(data){
            $scope.auditTrail = data;
        },
        function(data){
            $scope.$emit('error', 'Error loading audit trail', new Error(data));
        });
}]);