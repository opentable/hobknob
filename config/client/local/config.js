"use strict";

 angular.module("config", [])

.constant("ENV", {
  "name": "development",
  "etcdHost": "127.0.0.1",
  "etcdPort": "4001",
  "etcdVersion": "v1"
});