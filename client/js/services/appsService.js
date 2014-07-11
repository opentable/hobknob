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
      this.selectedApp.loadToggles();
      console.log(this);
    }


  };

  return new AppsService();


});