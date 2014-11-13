featureToggleFrontend.controller('FeatureCategoriesController', ['$scope', '$timeout', 'toggleService', 'focus', 'ENV',  'Category', function($scope, $timeout, toggleService, focus, ENV, Category) {

    $scope.isFeatureUnique = function(featureName){
        return !_
            .chain($scope.categories)
            .map(function(category) { 
                var featureNames =  _.map(category.features, function(feature) {
                    return feature.name; 
                }); 
                return featureNames;
            })
            .flatten()
            .any(function(existingFeature) { 
                return existingFeature === featureName; 
            })
            .value();
    };

    $scope.addFakeFeature = function(featureName, categoryId){
        var category = _.find($scope.categories, function(category) { 
            return category.id === categoryId; 
        });

        var toggleValues = new Category(category.id).isSimple()
            ? [false] 
            : _.map(category.columns, function(column) { return null; });
 
        category.features.push({
            name: featureName,
            values: toggleValues
        });
    };

    $scope.loadingFeatureCategories = true;
    toggleService.getFeatureCategories($scope.applicationName,
        function(categories){
            $scope.categories = categories;
            $scope.loadingFeatureCategories = false;
        },
        function(data){
            $scope.$emit('error', "Failed to load feature toggles", new Error(data));
            $scope.loadingFeatureCategories = false;
        });
}]);