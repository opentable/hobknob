'use strict';

angular.module('featureToggleFrontend')

.factory('Toggle', function() {

  function Toggle(data){
    angular.extend(this, data);
    this.boolValue = this.value === "true";
    console.log(this);
  }

  Toggle.create = function(data){
    console.log(data);

    return new Toggle(data);
  };

  return Toggle;

});