featureToggleFrontend.controller('ApplicationController', ['$scope', '$routeParams', '$timeout', 'applicationService', 'focus', 'ENV', function($scope, $routeParams, $timeout, applicationService, focus, ENV) {

    $scope.applicationName = $routeParams.appName;
    $scope.toggles = [];
    $scope.adding = false;
    $scope.newToggleName = '';

    var loadToggles = function() {
        applicationService.getToggles($scope.applicationName,
            function(toggles){
                $scope.toggles = toggles;
            },
            function(data, status, headers, config){
                // todo: do something with error
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

    var setToggle = function(name, value, success, error){
        applicationService.updateToggle($scope.applicationName, name, value, success, error);
    };

    $scope.updateThisToggle = function(toggle) {
        $timeout(function(){
            setToggle(toggle.name, toggle.value,
                function(status){

                },
                function(data, status, headers, config){
                    // todo: do something with error
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
            console.log(validationError);
            //todo: raise this error on the UI
            return;
        }

        setToggle(toggleName, false,
            function(){
                $scope.toggles.push(
                    {
                        name: toggleName,
                        value: false,
                        fullPath: 'http://' + ENV.etcdHost + ':' + ENV.etcdPort + '/v2/keys/v1/toggles/' + $scope.applicationName + '/' + toggleName
                    });
                $scope.setAddingToggleState(false);
            },
            function(data, status, headers, config){
                // todo: do something with error
            });
    };

    loadToggles();
}]);