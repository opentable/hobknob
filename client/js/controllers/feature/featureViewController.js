'use strict';

Frontend.controller('FeatureViewController', ['$scope', '$routeParams', function ($scope, $routeParams) {

    $scope.applicationName = $routeParams.applicationName;
    $scope.featureName = $routeParams.featureName;

}]);
