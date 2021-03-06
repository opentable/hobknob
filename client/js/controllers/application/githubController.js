'use strict';

featureToggleFrontend.controller('GithubController', ['$scope', 'applicationService', function ($scope, applicationService) {
    $scope.githubRepoUrl = '';
    $scope.githubRepoUrlLoading = true;

    applicationService.getApplicationMetaData($scope.applicationName,
        function (err, metaData) {
            if (err) {
                return $scope.$emit('error', 'Failed to load application meta data', new Error(data));
            }
            $scope.githubRepoUrl = metaData.githubRepoUrl;
            $scope.githubRepoUrlLoading = false;
        });

    $scope.saveGithubRepoUrl = function () {
        applicationService.saveApplicationMetaData($scope.applicationName, 'githubRepoUrl', $scope.githubRepoUrl, function (err) {
            if (err) {
                $scope.$emit('error', 'Failed to save the github repo url', new Error(data));
            } else {
                $scope.$emit('success', 'Successfully updated the Github repo url.');
            }
        });
    };
}]);
