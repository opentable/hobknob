featureToggleFrontend.controller('FeatureCategoryController', ['$scope', '$timeout', 'toggleService', 'focus', 'ENV', ($scope, $timeout, toggleService, focus, ENV) => {
  $scope.adding = false;
  $scope.newFeatureName = '';
  $scope.newFeatureDescription = '';
  $scope.setAddingFeatureState = (state) => {
    $scope.adding = state;
    if (state) {
      focus('newFeatureName');
    } else {
      $scope.newFeatureName = '';
    }
  };

  const validateNewFeature = (featureName) => {
    if (!featureName) {
      return 'Must enter an feature name';
    }
    if (!$scope.isFeatureUnique(featureName)) {
      return 'Feature name must be unique in this application';
    }
    if (!/^[a-z0-9._-]+$/i.test(featureName)) {
      return 'Feature name must be alphanumeric with no spaces';
    }

    return null;
  };

  $scope.addFeature = () => {
    const categoryId = $scope.category.id;
    const featureName = $scope.newFeatureName.trim();
    const featureDescription = $scope.newFeatureDescription.trim();
    const validationError = validateNewFeature(featureName);
    if (validationError) {
      $scope.$emit('error', validationError);
      return;
    }

    toggleService.addFeature($scope.applicationName, categoryId, featureName, featureDescription,
      () => {
        $scope.addFakeFeature(featureName, featureDescription, categoryId);
        $scope.setAddingFeatureState(false);
        $scope.$emit('success', `${featureName} was successfully added`);
      },
      (data) => {
        $scope.$emit('error', 'Failed to add feature', new Error(data));
      });
  };

  $scope.updateFeatureDescription = (featureName, newFeatureDescription) => {
    toggleService.updateFeatureDescription($scope.applicationName, featureName, newFeatureDescription,
      () => {
        $scope.$emit('success', `${featureName}'s description was successfully updated`);
      },
      (data) => {
        $scope.$emit('error', 'Failed to update feature', new Error(data));
      });
  };
}]);
