featureToggleFrontend.controller('SideBarController', ['$scope', 'toggleService', '$location', 'focus', 'CurrentUser', function($scope, toggleService, $location, focus, CurrentUser) {

    $scope.applications = [];
    $scope.newApplicationName = '';
    $scope.adding = false;

    $scope.CurrentUser = CurrentUser;

    var loadApplications = function(){
        toggleService.getApplications(
            function(data){
                $scope.applications = data;
            },
            function(data){
                $scope.$emit('error', "Failed to load applications", new Error(data));
            });
    };

    $scope.setAddingApplicationState = function(state){
        $scope.adding = state;
        if (state){
            focus('newApplicationName');
        }
        else{
            $scope.newApplicationName = '';
        }
    };

    var validateNewApplication = function(applicationName){
        if (!applicationName){
            return "Must enter an application name";
        }
        if (_.any($scope.applications, function(application) { return application == applicationName})) {
            return "Application already exists";
        }
    };

    var grantUser = function(applicationName, userEmail, callback) {
        var user = {
            email: userEmail
        };

        toggleService.grant(applicationName, user,
            function(){
                callback();
            },
            function(data){
                callback(new Error(data));
            });
    };

    $scope.addApplication = function(){
        var applicationName = $scope.newApplicationName;

        var validationError = validateNewApplication(applicationName);
        if (validationError){
            console.log(validationError);
            $scope.$emit('error', validationError);
            return;
        }

        toggleService.addApplication(applicationName,
            function(status){
                if (status === 201) { // created
                    grantUser(applicationName, CurrentUser.email, function(err) {
                        $scope.applications.push(applicationName);
                        if (err){
                            $scope.$emit('error', "Application created but current user could not be added to list of application owners", err);
                        } else {
                            $location.path('/applications/' + applicationName)
                        }
                    });
                }
                $scope.setAddingApplicationState(false);
            },
            function(data){
                $scope.$emit('error', "Failed to add application", new Error(data));
            });
    };

    $scope.isActive = function(applicationName) {
        return ($location.path() === '/applications/' + applicationName);
    };

    loadApplications();
}]);