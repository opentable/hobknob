featureToggleFrontend.controller('ToggleListController', ['$scope', '$routeParams', '$timeout', 'toggleService', 'authorisationService', 'focus', 'ENV', function($scope, $routeParams, $timeout, toggleService, authorisationService, focus, ENV) {

    $scope.toggles = [];
    $scope.adding = false;
    $scope.newToggleName = '';

    var loadToggles = function() {
        toggleService.getToggles($scope.applicationName,
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
            toggleService.updateToggle($scope.applicationName, toggle.name, toggle.value,
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

        toggleService.addToggle($scope.applicationName, toggleName, false,
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

    loadToggles();
}]);