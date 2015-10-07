'use strict';

featureToggleFrontend.controller('ApplicationOwnersController', ['$scope', 'authorisationService', 'focus', function ($scope, authorisationService, focus) {
    $scope.users = [];
    $scope.addingUser = false;
    $scope.newUserEmail = '';
    $scope.loadingUsers = true;

    var loadUsers = function () {
        if (!$scope.requiresAuthentication) return;

        authorisationService.getUsers($scope.applicationName,
            function (users) {
                $scope.users = users;
                $scope.loadingUsers = false;
            },
            function (data) {
                $scope.$emit('error', 'Failed to load application owners', new Error(data));
                $scope.loadingUsers = false;
            });
    };

    $scope.setAddingUserState = function (state) {
        $scope.addingUser = state;
        if (state) {
            focus('newUserEmail');
        }
        else {
            $scope.newUserEmail = '';
        }
    };

    var validateNewUser = function (email) {
        if (!validator.isEmail(email)) {
            return 'Invalid email address';
        }
        if (_.any($scope.users, function (existingUser) {
                return existingUser === email;
            })) {
            return 'This user is already added to this application';
        }
    };

    $scope.grantUser = function () {
        var email = $scope.newUserEmail;

        var validationError = validateNewUser(email);
        if (validationError) {
            $scope.$emit('error', validationError);
            return;
        }

        authorisationService.grant($scope.applicationName, email,
            function () {
                $scope.users.push(email);
                $scope.setAddingUserState(false);
                $scope.$emit('success', email + ' was successfully made an application owner');
            },
            function (data) {
                $scope.$emit('error', 'Failed to add user to the application owners', new Error(data));
            });
    };

    $scope.revokeUser = function (email) {
        authorisationService.revoke($scope.applicationName, email,
            function () {
                var index = $scope.users.indexOf(email);
                if (index > -1) {
                    $scope.users.splice(index, 1);
                }
            },
            function (data) {
                $scope.$emit('error', 'Failed to remove user from the application owners', new Error(data));
            });
    };

    loadUsers();
}]);
