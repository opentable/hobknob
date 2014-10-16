featureToggleFrontend.controller('ApplicationController', ['$scope', '$routeParams', '$timeout', 'applicationService', 'focus', 'ENV', 'CurrentUser', function($scope, $routeParams, $timeout, applicationService, focus, ENV, CurrentUser) {

    $scope.applicationName = $routeParams.appName;

    $scope.toggles = [];
    $scope.adding = false;
    $scope.newToggleName = '';

    $scope.users = [];
    $scope.addingUser = false;
    $scope.newUserEmail = '';

    $scope.requiresAuthentication = CurrentUser.requiresAuthentication();

    if ($scope.requiresAuthentication){
        applicationService.isUserAuthorised($scope.applicationName, CurrentUser.email, function(err, isAuthorised){
            $scope.userHasPermissions = !err && isAuthorised;
        });
    } else {
        $scope.userHasPermissions = true;
    }

    var loadToggles = function() {
        applicationService.getToggles($scope.applicationName,
            function(toggles){
                $scope.toggles = toggles;
            },
            function(data){
                $scope.$emit('error', "Failed to load toggles", new Error(data));
            });
    };

    $scope.setAddingToggleState = function(state){
        $scope.adding = state;
        if (state){
            focus('newToggleName');
        }
        else{
            $scope.newToggleName = '';
        }
    };

    $scope.updateThisToggle = function(toggle) {
        $timeout(function(){
            applicationService.updateToggle($scope.applicationName, toggle.name, toggle.value,
                function(){
                },
                function(data){
                    $scope.$emit('error', "Failed to update toggle", new Error(data));
                });
        });
    };

    var validateNewToggle = function(toggleName){
        if (!toggleName){
            return "Must enter an toggle name";
        }
        if (_.any($scope.toggles, function(toggle) { return toggle.name == toggleName})) {
            return "Toggle already exists";
        }
    };

    $scope.addToggle = function() {
        var toggleName = $scope.newToggleName;

        var validationError = validateNewToggle(toggleName);
        if (validationError){
            $scope.$emit('error', validationError);
            return;
        }

        applicationService.addToggle($scope.applicationName, toggleName, false,
            function(){
                $scope.toggles.push(
                    {
                        name: toggleName,
                        value: false,
                        fullPath: 'http://' + ENV.etcdHost + ':' + ENV.etcdPort + '/v2/keys/v1/toggles/' + $scope.applicationName + '/' + toggleName
                    });
                $scope.setAddingToggleState(false);
                $scope.$emit('success', toggleName + " was successfully added");
            },
            function(data){
                $scope.$emit('error', "Failed to add toggle", new Error(data));
            });
    };

    var loadUsers = function() {
        applicationService.getUsers($scope.applicationName,
            function(users){
                $scope.users = users;
            },
            function(data){
                $scope.$emit('error', "Failed to load application owners", new Error(data));
            });
    };

    $scope.setAddingUserState = function(state){
        $scope.addingUser = state;
        if (state){
            focus('newUserEmail');
        }
        else{
            $scope.newUserEmail = '';
        }
    };

    var validateNewUser = function(user){
        if (!validator.isEmail(user.email)){
            return "Invalid email address";
        }
        if (_.any($scope.users, function(existingUser) { return existingUser.email == user.email})) {
            return "This user is already added to this application";
        }
    };

    $scope.grantUser = function() {
        var email = $scope.newUserEmail;
        var user = {
            email: email
        };

        var validationError = validateNewUser(user);
        if (validationError){
            $scope.$emit('error', validationError);
            return;
        }

        applicationService.grant($scope.applicationName, user,
            function(){
                $scope.users.push(user);
                $scope.setAddingUserState(false);
                $scope.$emit('success', user.email + " was successfully made an application owner");
            },
            function(data){
                $scope.$emit('error', "Failed to add user to the application owners", new Error(data));
            });
    };

    $scope.revokeUser = function(user) {
        applicationService.revoke($scope.applicationName, user.email,
            function(){
                var index = $scope.users.indexOf(user);
                if (index > -1) {
                    $scope.users.splice(index, 1);
                }
            },
            function(data){
                $scope.$emit('error', "Failed to remove user from the application owners", new Error(data));
            });
    };

    loadToggles();
    loadUsers();
}]);