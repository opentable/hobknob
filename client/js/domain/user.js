'use strict';

angular.module('featureToggleFrontend')
    .factory('CurrentUser', function ($window, ENV) {
        function CurrentUser() {
            if (ENV.RequiresAuth === true) {
                var data = $window.user._json;
                angular.extend(this, data);
            }
        }

        // todo: what does this do?
        CurrentUser.create = function (data) {
            return new CurrentUser(data);
        };

        CurrentUser.prototype = {

            getPicture: function () {
                return this.picture || '/img/user-blue.jpeg';
            },

            getUser: function () {
                return this;
            },

            getFullName: function () {
                return this.name || 'Anonymous';
            },

            requiresAuthentication: function () {
                return ENV.RequiresAuth;
            }

        };

        return new CurrentUser();
    });
