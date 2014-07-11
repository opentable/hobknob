'use strict';

angular.module('featureToggleFrontend')

.factory('Toggle', function() {

  function Toggle(data){
    angular.extend(this, data);
    this.boolValue = this.value === "true";
  }

  Toggle.create = function(data){
    return new Toggle(data);
  };

  return Toggle;

});