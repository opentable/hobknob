var featureToggleFrontend = angular.module('featureToggleFrontend', ['ngResource', 'ngRoute', 'ui.bootstrap', 'config', 'toggle-switch']);

featureToggleFrontend.config(function($routeProvider, $locationProvider, $httpProvider) {
    'use strict';

	$locationProvider.hashPrefix('!');
  	$routeProvider.
	    when('/', {
	      controller: 'DashboardController',
	      templateUrl: 'partials/dashboard'      
	    }).
	    when('/applications/:appName', {
	    	controller: 'ApplicationController',
	    	templateUrl: 'partials/application'
	    }).
      when('/applications/:appName/:toggleName', {
        controller: 'ToggleController',
        templateUrl: 'partials/toggle'
      });

    $httpProvider.defaults.headers.put = { "Content-Type": "application/json" };
    $httpProvider.defaults.headers.post = { "Content-Type": "application/json" };
});