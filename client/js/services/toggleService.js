'use strict';

angular.module('featureToggleFrontend')

.factory('ToggleService', function(ENV, $http, etcdApiService, App, Toggle) {

  function ToggleService(){

  }

  ToggleService.prototype = {

    loadToggle:function(appName, toggleName){
      return etcdApiService.getToggle(appName, toggleName);
    }

  };

  return new ToggleService();


});