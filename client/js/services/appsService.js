'use strict';

angular.module('featureToggleFrontend')

.factory('AppsService', function(ENV, $http, etcdApiService, App, Toggle) {

  function AppsService(){
    this.apps = [];
    this.selectedApp = null;
  }

  AppsService.prototype = {

    loadApps:function(){
      return etcdApiService.getApplications()
        .success(this.setApps.bind(this));
    },

    loadApp:function(appName){
      return etcdApiService.getApplication(appName)
        .success(this.setSelectedApp.bind(this));
    },

    setSelectedApp: function(response) {
      var app = App.create(response.node);
      this.selectedApp = app;
      this.selectedApp.loadToggles();
    },

    setApps:function(response){
      this.apps = response.node.nodes.map(App.create);
      this.selectedApp = this.selectedApp || this.apps[0];
      this.selectedApp.loadToggles();
    },

    loadToggle:function(appName, toggleName){
      return etcdApiService.getToggle(appName, toggleName)
        .success(this.setSelectedToggle.bind(this));
    },

    setSelectedToggle: function(response) {
      var toggle = Toggle.create(response.node);
      this.selectedToggle = toggle;
      this.selectedToggle.loadAudit();
    },

    updateToggle: function(toggle) {
      return etcdApiService.updateToggle(toggle);
    }

  };

  return new AppsService();


});