featureToggleFrontend.controller('ApplicationOwnersController', ['$scope', '$routeParams', '$timeout', 'toggleService', 'authorisationService', 'focus', function($scope, $routeParams, $timeout, toggleService, authorisationService, focus) {

    $scope.users = [];
    $scope.addingUser = false;
    $scope.newUserEmail = '';

    var loadUsers = function() {
        authorisationService.getUsers($scope.applicationName,
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

        authorisationService.grant($scope.applicationName, user,
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
        authorisationService.revoke($scope.applicationName, user.email,
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

    loadUsers();
}]);