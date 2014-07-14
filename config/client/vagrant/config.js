"use strict";

 angular.module("config", [])

.constant("ENV", {
  "name": "development",
  "etcdHost": "coreos-etcd",
  "etcdPort": "4001",
  "etcdVersion": "v1"
});