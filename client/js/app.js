'use strict';

var featureToggleFrontend = angular.module('featureToggleFrontend', ['ngResource', 'ngRoute', 'ui.bootstrap', 'config', 'toggle-switch']);

featureToggleFrontend.config(function($routeProvider, $locationProvider, $httpProvider) {
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

    $httpProvider.defaults.headers.put = { "Content-Type": "application/x-www-form-urlencoded" };
    $httpProvider.defaults.headers.post = { "Content-Type": "application/x-www-form-urlencoded" };
});