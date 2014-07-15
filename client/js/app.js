'use strict';

var featureToggleFrontend = angular.module('featureToggleFrontend', ['ngResource', 'ngRoute', 'ui.bootstrap', 'config', 'toggle-switch']);

featureToggleFrontend.config(function($routeProvider, $locationProvider) {
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
});