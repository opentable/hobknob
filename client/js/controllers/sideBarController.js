featureToggleFrontend.controller('SideBarController', ['$scope', 'applicationService', '$location', 'focus', function($scope, applicationService, $location, focus) {

    $scope.applications = [];
    $scope.newApplicationName = '';
    $scope.adding = false;

    var loadApplications = function(){
        applicationService.getApplications(
            function(data){
                $scope.applications = data;
            },
            function(){
                // todo: do something with error
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
    }

    $scope.addApplication = function(){
        var applicationName = $scope.newApplicationName;

        var validationError = validateNewApplication(applicationName);
        if (validationError){
            console.log(validationError);
            //todo: raise this error on the UI
            return;
        }

        applicationService.addApplication(applicationName, applicationName,
            function(status){
                if (status === 201) { // created
                    $scope.applications.push(applicationName);
                    $location.path('/applications/' + applicationName)
                }
                $scope.setAddingApplicationState(false);
            },
            function(){
                // todo: do something with error
                $scope.setAddingApplicationState(false);
            });
    };

    $scope.isActive = function(applicationName) {
        return ($location.path() === '/applications/' + applicationName);
    };

    loadApplications();
}]);