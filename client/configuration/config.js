"use strict";

 angular.module("config", [])

.constant("ENV", {
  "RequiresAuth": true,
 "AuthProviders":{
     "GoogleAuth": {
         "GoogleClientId": "696344497174-jcs2nssg5f0n6b7knjsq8ugbclnfcm7u.apps.googleusercontent.com",
         "GoogleClientSecret": "RHe0k9C1DBUqtBjDLHL60fKA"
     }
 },
  "name": "development",
  "etcdUri": "http://127.0.0.1:4001",
  "etcdVersion": "v1",
  "etcdCoreVersion": "v2",
  "etcdHost": "127.0.0.1",
  "etcdPort": "4001",
  "hobknobHost": "127.0.0.1",
  "hobknobPort": "3006"
});