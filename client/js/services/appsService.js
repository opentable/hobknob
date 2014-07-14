'use strict';

angular.module('featureToggleFrontend')

.factory('AppsService', function(ENV, $http, etcdApiService, App) {

  function AppsService(){
    this.apps = [];
    this.selectedApp = null;
  }

  AppsService.prototype = {

    loadApps:function(){
      return etcdApiService.getApplications()
        .success(this.setApps.bind(this));
    },

    setApps:function(response){
      this.apps = response.node.nodes.map(App.create);
      this.selectedApp = this.apps[0];
      //this.selectedApp.loadToggles();

      //This may be mental. We're affectively loading ALL THE THINGS!!! Speak to etcd guys for stats count endpoint
      for(var i = 0; i<this.apps.length; i++){
        this.apps[i].loadToggles();
      }
    },

    updateToggle: function(toggle) {
      return etcdApiService.updateToggle(toggle);
    }

  };

  return new AppsService();


});