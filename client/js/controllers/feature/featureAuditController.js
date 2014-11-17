featureToggleFrontend.controller('FeatureAuditController', ['$scope', 'auditService', function($scope, auditService) {

    $scope.auditTrail = [];

    auditService.getFeatureAuditTrail($scope.applicationName, $scope.featureName,
        function(data){
            $scope.auditTrail = data;
        },
        function(data){
            $scope.$emit('error', 'Error loading audit trail', new Error(data));
        });
}]);