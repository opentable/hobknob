'use strict';

angular.module('featureToggleFrontend')

.factory('Audit', function(etcdPathService) {

  function Audit(data){
    angular.extend(this, data);
  };

  Audit.createAction = function(applicationName, toggleName, user){
    return new Audit({
      applicationName:applicationName,
      toggleName:toggleName,
      value:"false",
      action:"create",
      user:user,
      dateModified: new Date().toString()
    })
  }

  Audit.updateAction = function(toggle, user){
    return new Audit({
      applicationName:toggle.applicationName,
      toggleName:toggle.toggleName,
      value:toggle.boolValue,
      boolValue: toggle.boolValue,
      action:"update",
      user:user,
      dateModified: new Date().toString()
    });
  }

  Audit.fromJSONString = function(json){
    return new Audit(angular.fromJson(json.value));
  }


  Audit.prototype = {
    toJSONString:function(){
      return JSON.stringify(this);
    }
  };

  return Audit;

})