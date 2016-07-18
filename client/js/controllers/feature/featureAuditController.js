'use strict';

featureToggleFrontend.controller('FeatureAuditController', ['$scope', 'auditService', 'CurrentUser', function ($scope, auditService, CurrentUser) {
    $scope.auditTrail = [];

    $scope.isObject = function(input) {
        return angular.isObject(input);
    };

    $scope.$on('toggleUpdated', function (event, toggle, isMultiToggle) {
        addFakeAudit(toggle.name, toggle.value, 'Updated', isMultiToggle);
    });

    var addFakeAudit = function (toggleName, value, action, isMultiToggle) {
        var newCreatedIndex = $scope.auditTrail ? _.max($scope.auditTrail, function (audit) {
            return audit.createdIndex;
        }).createdIndex + 1 : 1;

        var fakeAudit = {
            user: {
                name: CurrentUser.getFullName()
            },
            toggleName: isMultiToggle ? toggleName : null,
            value: value,
            action: action,
            dateModified: moment().toISOString(),
            createdIndex: newCreatedIndex
        };

        $scope.auditTrail.push(fakeAudit);
    };

    auditService.getFeatureAuditTrail($scope.applicationName, $scope.featureName,
        function (data) {
            $scope.auditTrail = data;
        },
        function (data) {
            $scope.$emit('error', 'Error loading audit trail', new Error(data));
        });
}]);
