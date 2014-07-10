"use strict";

 angular.module("config", [])

.constant("ENV", {
  "name": "development",
  "etcdUri": "http://127.0.0.1:4001",
  "etcdVersion": "v1"
})

;