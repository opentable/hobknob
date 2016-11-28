'use strict';

featureToggleFrontend.controller('SideBarController', ['$scope', 'applicationService', 'authorisationService', '$location', 'focus', 'CurrentUser', 'ENV', function ($scope, applicationService, authorisationService, $location, focus, CurrentUser, ENV) {
    $scope.applications = [];
    $scope.newApplicationName = '';
    $scope.adding = false;
    $scope.CurrentUser = CurrentUser;
    $scope.logo = ENV.customization.logo;

    var loadApplications = function () {
        applicationService.getApplications(
            function (data) {
                $scope.applications = data;
            },
            function (data) {
                $scope.$emit('error', 'Failed to load applications', new Error(data));
            });
    };

    $scope.setAddingApplicationState = function (state) {
        $scope.adding = state;
        if (state) {
            focus('newApplicationName');
        }
        else {
            $scope.newApplicationName = '';
        }
    };

    var validateNewApplication = function (applicationName) {
        if (!applicationName) {
            return 'Must enter an application name';
        }
        if (_.any($scope.applications, function (application) {
                return application.toLowerCase() === applicationName.toLowerCase();
            })) {
            return 'Application already exists';
        }
        if (!/^[a-z0-9-_.]+$/i.test(applicationName)) {
            return 'Application name must be alphanumeric with no spaces';
        }
    };

    $scope.addApplication = function () {
        var applicationName = $scope.newApplicationName;

        var validationError = validateNewApplication(applicationName);
        if (validationError) {
            $scope.$emit('error', validationError);
            return;
        }

        applicationService.addApplication(applicationName,
            function (status) {
                if (status === 201) { // created
                    $scope.applications.push(applicationName);
                    $location.path('/applications/' + applicationName);
                }
                $scope.setAddingApplicationState(false);
            },
            function (data) {
                $scope.$emit('error', 'Failed to add application', new Error(data));
            });
    };


    $scope.isActive = function (applicationName) {
        var appUrlPart = '/applications/' + applicationName;
        return $location.path() === appUrlPart || $location.path().indexOf(appUrlPart + '/') > -1;
    };

    $scope.$on('$locationChangeSuccess', function () {
        loadApplications();
    });

    loadApplications();
}]);
