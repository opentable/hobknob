
featureToggleFrontend.controller('ToggleDataController', ['$scope', '$timeout', 'toggleService', 'focus', 'ENV', function($scope, $timeout, toggleService, focus, ENV) {

    var loadToggles = function() {
        $scope.toggles = [];
        $scope.loadingToggles = true;
        $scope.isMultiToggle = false;

        toggleService.getFeature($scope.applicationName, $scope.featureName,
            function(feature){
                $scope.toggles = feature.toggles;
                $scope.isMultiToggle = feature.isMultiToggle;
                $scope.loadingToggles = false;
            },
            function(data){
                $scope.$emit('error', "Failed to load this feature toggle", new Error(data));
                $scope.loadingToggles = false;
            });
    };

    $scope.updateThisToggle = function(toggle){
        if (!$scope.userHasPermissions) return;

        $timeout(function(){
            toggleService.updateFeatureToggle($scope.applicationName, $scope.featureName, $scope.isMultiToggle,
                toggle.name, toggle.value, function(){},
                function(data){
                    $scope.$emit('error', "Failed to update toggle", new Error(data));
                });
        });
    };

    loadToggles();
}]);
