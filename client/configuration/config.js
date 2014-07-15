"use strict";

 angular.module("config", [])

.constant("ENV", {
  "name": "development",
  "etcdHost": "127.0.0.1",
  "etcdPort": "4001",
  "etcdVersion": "v2"
})

.config(function($httpProvider){
     $httpProvider.defaults.headers.put = { "Content-Type": "application/x-www-form-urlencoded" };
     $httpProvider.defaults.headers.post = { "Content-Type": "application/x-www-form-urlencoded" };
 });