'use strict';

var featureToggleFrontend = angular.module('featureToggleFrontend', ['ngResource', 'ngRoute', 'ui.bootstrap', 'config', 'toggle-switch']);

featureToggleFrontend.config(function($routeProvider) {
  $routeProvider.
    when('/', {
      controller: 'DashboardController',
      templateUrl: 'partials/dashboard'      
    });
});