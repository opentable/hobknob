'use strict';

featureToggleFrontend.controller('ApplicationDangerController', ['$scope', '$route', 'applicationService', '$location', function ($scope, $route, applicationService, $location) {
    $scope.confirm = false;

    $scope.deleteApplication = function () {
        var applicationName = $scope.applicationName;

        if (!$scope.confirm) {
            $scope.confirm = true;
            return;
        }

        applicationService.deleteApplication(applicationName, function (err) {
            if (err) {
                $scope.$emit('error', 'Failed to delete application. See console for more detail.', err);
                return;
            }

            $location.path('/');
        });
    };
}]);
