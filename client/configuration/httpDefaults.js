"use strict";

angular.module("config", [])

.config(function($httpProvider) {
    $httpProvider.defaults.headers.put = { "Content-Type": "application/x-www-form-urlencoded" };
    $httpProvider.defaults.headers.post = { "Content-Type": "application/x-www-form-urlencoded" };
});