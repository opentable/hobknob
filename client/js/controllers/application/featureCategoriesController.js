featureToggleFrontend.controller('FeatureCategoriesController', ['$scope', '$timeout', 'toggleService', 'focus', 'ENV', function($scope, $timeout, toggleService, focus, ENV) {

    $scope.categories = [];
    $scope.loadingFeatureCategories = false;

    var loadFeatureCategories = function() {
        toggleService.getFeatureCategories($scope.applicationName,
            function(categories){
                $scope.categories = categories;
                $scope.loadingFeatureCategories = false;
            },
            function(data){
                $scope.$emit('error', "Failed to load feature toggles", new Error(data));
                $scope.loadingFeatureCategories = false;
            });
    };

    $scope.isFeatureUnique = function(featureName){
        return !_.chain($scope.categories)
            .map(function(category) { return _.map(category.features, function(feature) { return feature.name; }); })
            .flatten()
            .any(function(existingFeature) { return existingFeature === featureName; })
            .value();
    };

    $scope.addFakeFeature = function(featureName, categoryId){
        var category = _.find($scope.categories, function(category) { return category.id === categoryId; });
        category.features.push({
            name: featureName,
            values: categoryId === 0 ? [false] : _.map(category.columns, function(column) { return null; })
        });
    };

    loadFeatureCategories();
}]);