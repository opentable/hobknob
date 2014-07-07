'use strict';

var featureToggleFrontend = angular.module('featureToggleFrontend', ['ngResource', 'ngRoute', 'ui.bootstrap']);

featureToggleFrontend.config(function($routeProvider) {
  $routeProvider.
    when('/', {
      controller: 'DashboardController',
      templateUrl: 'partials/dashboard'      
    });
});