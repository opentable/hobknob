featureToggleFrontend.controller('AlertController', ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout) {

    $scope.alert = null;

    $rootScope.$on('success', function(event, message){
        $scope.alert = {
            message: message,
            date: new Date(),
            class: "alert-success"
        };
    });

    $rootScope.$on('error', function(event, message, err){
        $scope.alert = {
            message: message,
            date: new Date(),
            class: "alert-danger"
        };

        console.log(message);
        if (err){
            console.log(err);
        }
    });

    $scope.$on('$locationChangeStart', function() {
        $scope.alert = null;
    });
}]);