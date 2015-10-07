'use strict';

featureToggleFrontend.controller('FeatureCategoriesController', ['$scope', '$timeout', 'toggleService', 'focus', 'ENV', 'Category', function ($scope, $timeout, toggleService, focus, ENV, Category) {
    $scope.isFeatureUnique = function (featureName) {
        var existingFeatureNames = _
            .chain($scope.categories)
            .map(function (category) {
                var featureNames = _.map(category.features, function (feature) {
                    return feature.name;
                });
                return featureNames;
            })
            .flatten()
            .value();
        return !_.any(existingFeatureNames, function (existingFeature) {
            return existingFeature.toLowerCase() === featureName.toLowerCase();
        });
    };

    $scope.addFakeFeature = function (featureName, featureDescription, categoryId) {
        var category = _.find($scope.categories, function (categoryIter) {
            return categoryIter.id === categoryId;
        });

        var toggleValues = new Category(category.id).isSimple() ? [false] : _.map(category.columns, function (column) {
            return null;
        });

        category.features.push({
            name: featureName,
            description: featureDescription,
            values: toggleValues
        });
    };

    $scope.loadingFeatureCategories = true;
    toggleService.getFeatureCategories($scope.applicationName,
        function (categories) {
            $scope.categories = categories;
            $scope.loadingFeatureCategories = false;
        },
        function (data) {
            $scope.$emit('error', 'Failed to load feature toggles', new Error(data));
            $scope.loadingFeatureCategories = false;
        });
}]);
