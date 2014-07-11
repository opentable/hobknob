'use strict';

angular.module('featureToggleFrontend')

.factory('Toggle', function(etcdPathService) {

  function Toggle(data){
    angular.extend(this, data);
    this.boolValue = this.value === "true";
    var parts = etcdPathService.explode(data.key);
    this.toggleName = parts[3];
    this.fullPath = etcdPathService.getFullKeyPath(data.key);
  }

  Toggle.create = function(data){
    return new Toggle(data);
  };

  return Toggle;

});