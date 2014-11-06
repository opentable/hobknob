featureToggleFrontend.controller('ToggleListController', ['$scope', '$timeout', 'toggleService', 'focus', 'ENV', function($scope, $timeout, toggleService, focus, ENV) {

    $scope.categories = [];
    $scope.loadingToggles = false;

    var loadCategories = function() {
        toggleService.getCategories($scope.applicationName,
            function(categories){
                $scope.categories = categories;
                $scope.loadingToggles = false;
            },
            function(data){
                $scope.$emit('error', "Failed to load feature toggles", new Error(data));
                $scope.loadingToggles = false;
            });
    };

//    var validateNewToggle = function(toggleName){
//        if (_.any($scope.toggles, function(toggle) { return toggle.name.toLowerCase() == toggleName.toLowerCase(); })) {
//            return "Toggle already exists";
//        }
//    };

    loadCategories();
}]);