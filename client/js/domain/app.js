'use strict';

angular.module('featureToggleFrontend')

.factory('App', function(etcdApiService, etcdPathService, Toggle) {

  function App(data){
    angular.extend(this, data);
    this.toggles = [];
    var parts = etcdPathService.explode(data.key);
    this.version = parts[0];
    this.appName = parts[2];
  }

  App.create = function(data){
    return new App(data);
  };

  App.prototype = {

    loadToggles:function(){
      return etcdApiService.getToggles(this.key)
        .success(this.setToggles.bind(this));
    },

    setToggles:function(response){
      this.toggles = response.node.nodes.map(Toggle.create);
    }

  };

  return App;

});
