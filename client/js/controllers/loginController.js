'use strict';

featureToggleFrontend.controller('LoginController', ['$scope', '$window', 'ENV', function ($scope, $window, ENV) {
    if (ENV.RequiresAuth) {
        var authProvider = Object.keys(ENV.AuthProviders)[0];

        $scope.authProvider = authProvider;
    }
    else {
        $window.location.href = '/';
    }
}]);
