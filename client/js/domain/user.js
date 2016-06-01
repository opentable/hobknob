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
				var picture;

				if (ENV.AuthProviders.AzureAuth) {
					picture = 'data:image/png;base64,' + this.picture;
				} else if (this.picture) {
					picture = this.picture;
                }
				else {
					picture = '/img/user-blue.jpeg';
				}

				return picture;
            },

            getUser: function () {
                return this;
            },

            getFullName: function () {
                return this.name.givenName + ' ' + this.name.familyName || 'Anonymous';
            },

            requiresAuthentication: function () {
                return ENV.RequiresAuth;
            }

        };

        return new CurrentUser();
    });
