angular.module('featureToggleFrontend')
  .factory('CurrentUser', function ($window, ENV) {
    function CurrentUser() {
      if (ENV.RequiresAuth === true) {
        const data = $window.user._json; // eslint-disable-line no-underscore-dangle
        angular.extend(this, data);
      }
    }

    // todo: what does this do?
    CurrentUser.create = function (data) {
      return new CurrentUser(data);
    };

    CurrentUser.prototype = {

      getPicture: () => {
        if (!ENV.RequiresAuth) {
          return '/img/user-blue.jpeg';
        }

        if (ENV.AuthProviders.AzureAuth && this.picture) {
          return `data:image/png;base64,${this.picture}`;
        }

        if (this.picture) {
          return this.picture;
        }

        return '/img/user-blue.jpeg';
      },

      getUser: () => this,
      getEmail: () => this.email.toLowerCase(),

      getFullName: () => {
        if (!ENV.RequiresAuth) {
          return 'Anonymous';
        }

        return `${this.name.givenName} ${this.name.familyName}`;
      },

      requiresAuthentication: () => ENV.RequiresAuth,

    };

    return new CurrentUser();
  });
