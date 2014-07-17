'use strict';

angular.module('featureToggleFrontend')

.factory('Audit', function(etcdPathService) {

  function Audit(data){
    angular.extend(this, data);
    this.dateModified = new Date().toString()
  };

  Audit.createAction = function(applicationName, toggleName, user){
    return new Audit({
      applicationName:applicationName,
      toggleName:toggleName,
      value:"false",
      action:"create",
      user:user
    })
  }

  Audit.updateAction = function(toggle, user){
    return new Audit({
      applicationName:toggle.applicationName,
      toggleName:toggle.toggleName,
      value:toggle.value,
      action:"update",
      user:user
    })
  }


  Audit.prototype = {
    toJSONString:function(){
      return JSON.stringify(this);
    }
  };

  return Audit;

})