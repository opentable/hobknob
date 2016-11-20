featureToggleFrontend.controller('FeatureCategoriesController', ['$scope', '$timeout', 'toggleService', 'focus', 'ENV', 'Category', ($scope, $timeout, toggleService, focus, ENV, Category) => {
  $scope.isFeatureUnique = (featureName) => {
    const existingFeatureNames = _
      .chain($scope.categories)
      .map(category => _.map(category.features, feature => feature.name))
      .flatten()
      .value();
    return !_.any(existingFeatureNames, existingFeature => existingFeature.toLowerCase() === featureName.toLowerCase());
  };

  $scope.addFakeFeature = (featureName, featureDescription, categoryId) => {
    const category = _.find($scope.categories, categoryIter => categoryIter.id === categoryId);

    const toggleValues = new Category(category.id).isSimple() ? [false] : _.map(category.columns, column => null);

    category.features.push({
      name: featureName,
      description: featureDescription,
      values: toggleValues,
    });
  };

  $scope.loadingFeatureCategories = true;
  toggleService.getFeatureCategories($scope.applicationName,
    (categories) => {
      $scope.categories = categories;
      $scope.loadingFeatureCategories = false;
    },
    (data) => {
      $scope.$emit('error', 'Failed to load feature toggles', new Error(data));
      $scope.loadingFeatureCategories = false;
    });
}]);
