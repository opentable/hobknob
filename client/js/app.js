'use strict';

var featureToggleFrontend = angular.module('featureToggleFrontend', ['ngResource', 'ngRoute', 'ui.bootstrap', 'toggle-switch', 'config', 'xeditable']);

featureToggleFrontend.config(function ($routeProvider, $locationProvider, $httpProvider) {
    $locationProvider.hashPrefix('!');
    $routeProvider.
    when('/', {
        controller: 'DashboardController',
        templateUrl: 'partials/dashboard'
    }).
    when('/profile', {
        controller: 'UserProfileController',
        templateUrl: 'partials/userProfile'
    }).
    when('/applications/:applicationName', {
        controller: 'ApplicationViewController',
        templateUrl: 'partials/application'
    }).
    when('/applications/:applicationName/:featureName', {
        controller: 'ApplicationViewController',
        templateUrl: 'partials/feature'
    });

    $httpProvider.defaults.headers.put = {'Content-Type': 'application/json'};
    $httpProvider.defaults.headers.post = {'Content-Type': 'application/json'};
});

featureToggleFrontend.run(function (editableOptions) {
    editableOptions.theme = 'bs3';
});
