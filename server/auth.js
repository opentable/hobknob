'use strict';

var passport = require('passport');
var request = require('request');
var jwt = require('jsonwebtoken');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var AzureStrategy = require('passport-azure-ad-oauth2');

module.exports.init = function (config) {
    if (config.RequiresAuth) {
        var protocolSection = (config.hobknobProtocol) ? config.hobknobProtocol : 'http';
        var portSection = (config.hobknobPort) ? ':' + config.hobknobPort : '';

        if (config.AuthProviders.GoogleAuth) {
            var GOOGLE_CLIENT_ID = config.AuthProviders.GoogleAuth.GoogleClientId;
            var GOOGLE_CLIENT_SECRET = config.AuthProviders.GoogleAuth.GoogleClientSecret;
            var googleCallbackURL = protocolSection + '://' + config.hobknobHost + portSection + '/auth/google/callback';

            passport.use(new GoogleStrategy({
                    clientID: GOOGLE_CLIENT_ID,
                    clientSecret: GOOGLE_CLIENT_SECRET,
                    callbackURL: googleCallbackURL
                },
                function (accessToken, refreshToken, profile, done) {
                    profile.accessToken = accessToken;
                    process.nextTick(function () {
                        return done(null, profile);
                    });
                }));
        } else if (config.AuthProviders.AzureAuth)
        {
          var AZURE_CLIENT_ID = config.AuthProviders.AzureAuth.AzureClientId;
          var AZURE_CLIENT_SECRET = config.AuthProviders.AzureAuth.AzureClientSecret;
          var AZURE_TENANT_ID = config.AuthProviders.AzureAuth.AzureTenantId;
          var azureCallbackURL = protocolSection + '://' + config.hobknobHost + portSection + '/auth/azureadoauth2/callback';

          passport.use('azure', new AzureStrategy({
                    clientID: AZURE_CLIENT_ID,
                    clientSecret: AZURE_CLIENT_SECRET,
                    callbackURL: azureCallbackURL,
                    tenant: AZURE_TENANT_ID,
                    resource: 'https://graph.windows.net/'
                  },
                  function (accessToken, refreshToken, params, profile, done) {
                        profile.accessToken = accessToken;

                        var decrypted = jwt.decode(profile.accessToken);

                        var profileData = {
                            name: decrypted.given_name,
                            fullName: decrypted.name,
                            email: decrypted.upn
                        };
                        getProfilePhotoFromAD(params.access_token, function (error, data) {
                            if (!error) {
                                profileData.picture = data;
                            }
                            else {
                                console.log(error);
                            }
                            profile._json = profileData;
                            process.nextTick(function() {
                                return done(null, profile);
                            });
                        });
                    }));
        }
    }

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (obj, done) {
        done(null, obj);
    });

    function getProfilePhotoFromAD(token, callback) {
        var options = {
            url: 'https://graph.windows.net/me/thumbnailPhoto?api-version=1.6',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            encoding: null
        };
        var r;
        var req = request(options, function(error, response, body) {
            if (!error) {
                 if (response.statusCode === 200) {
                    try {
                        r = new Buffer(body).toString('base64');

                        // Call callback with no error, and result of request
                        return callback(null, r);
                    } catch (e) {
                        // Call callback with error
                        return callback(e);
                    }
                 } else {
                     var errorData = {
                         StatusCode: response.statusCode,
                         Body: response.body
                     };
                     return callback(errorData);
                 }
            }
            else {
                console.log('Error: ' + error);
                return callback(error);
            }
        });
    }

    return passport;
};
