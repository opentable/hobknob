featureToggleFrontend.controller('ToggleListController', ['$scope', '$timeout', 'toggleService', 'focus', 'ENV', function($scope, $timeout, toggleService, focus, ENV) {

    $scope.toggles = [];
    $scope.adding = false;
    $scope.newToggleName = '';
    $scope.loadingToggles = true;

    var loadToggles = function() {
        toggleService.getToggles($scope.applicationName,
            function(toggles){
                $scope.toggles = toggles;
                $scope.loadingToggles = false;
            },
            function(data){
                $scope.$emit('error', "Failed to load toggles", new Error(data));
                $scope.loadingToggles = false;
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
        if (!$scope.userHasPermissions) return;

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
        if (_.any($scope.toggles, function(toggle) { return toggle.name.toLowerCase() == toggleName.toLowerCase(); })) {
            return "Toggle already exists";
        }
        if (!/^[a-z0-9.\w-]+$/i.test(toggleName)){
            return "Toggle name must be alphanumeric with no spaces";
        }
    };

    $scope.addToggle = function() {
        var toggleName = $scope.newToggleName.trim();

        var validationError = validateNewToggle(toggleName);
        if (validationError){
            $scope.$emit('error', validationError);
            return;
        }

        toggleService.addToggle($scope.applicationName, toggleName, false,
            function(){
                var fakeToggle = {
                    name: toggleName,
                    fullPath: "http://" + ENV.etcdHost + ":" + ENV.etcdPort + "/v2/keys/v1/toggles/" + $scope.applicationName + "/" + toggleName,
                    value: false
                };
                $scope.toggles.push(fakeToggle);
                $scope.setAddingToggleState(false);
                $scope.$emit('success', toggleName + " was successfully added");
            },
            function(data){
                $scope.$emit('error', "Failed to add toggle", new Error(data));
            });
    };

    loadToggles();
}]);
