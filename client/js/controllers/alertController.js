featureToggleFrontend.controller('AlertController', ['$scope', '$rootScope', function ($scope, $rootScope) {

    $scope.alert = null;

    $rootScope.$on('success', function (event, message) {
        $scope.alert = {
            message: message,
            class: "alert-success"
        };
    });

    $rootScope.$on('error', function (event, message, err) {
        $scope.alert = {
            message: message,
            class: "alert-danger"
        };

        if (err) {
            console.log(err);
        }
    });

    $scope.$on('$locationChangeStart', function () {
        $scope.alert = null;
    });
}]);
