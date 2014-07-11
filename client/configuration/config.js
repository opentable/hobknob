"use strict";

 angular.module("config", [])

.constant("ENV", {
  "name": "development",
  "etcdUri": "http://127.0.0.1:4001"
})

.config(['$httpProvider', function ($httpProvider) {
     // this delete the Content-Type header on all PUT requests. This is required as Etcd doesn't allow this header.
     delete $httpProvider.defaults.headers.put['Content-Type'];
}]);
;