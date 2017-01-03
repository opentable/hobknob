const passport = require('passport');
const request = require('request');
const jwt = require('jsonwebtoken');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const AzureStrategy = require('passport-azure-ad-oauth2');

function getProfilePhotoFromAD(token, callback) {
  const options = {
    url: 'https://graph.windows.net/me/thumbnailPhoto?api-version=1.6',
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    },
    encoding: null,
  };
  let r;
  const req = request(options, (error, response, body) => {
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
        const errorData = {
          StatusCode: response.statusCode,
          Body: response.body
        };
        return callback(errorData);
      }
    } else {
      console.log(`Error: ${error}`);
      return callback(error);
    }
  });
}

module.exports.init = (config) => {
  if (config.RequiresAuth) {
    const protocolSection = (config.hobknobProtocol) ? config.hobknobProtocol : 'http';
    const portSection = (config.hobknobPort) ? `:${config.hobknobPort}` : '';

    if (config.AuthProviders.GoogleAuth) {
      const GOOGLE_CLIENT_ID = config.AuthProviders.GoogleAuth.GoogleClientId;
      const GOOGLE_CLIENT_SECRET = config.AuthProviders.GoogleAuth.GoogleClientSecret;
      const googleCallbackURL = `${protocolSection}://${config.hobknobHost}${portSection}/auth/google/callback`;

      passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: googleCallbackURL
      },
      (accessToken, refreshToken, profile, done) => {
        profile.accessToken = accessToken;
        process.nextTick(() => done(null, profile));
      }));
    } else if (config.AuthProviders.AzureAuth) {
      const AZURE_CLIENT_ID = config.AuthProviders.AzureAuth.AzureClientId;
      const AZURE_CLIENT_SECRET = config.AuthProviders.AzureAuth.AzureClientSecret;
      const AZURE_TENANT_ID = config.AuthProviders.AzureAuth.AzureTenantId;
      const azureCallbackURL = `${protocolSection}://${config.hobknobHost}${portSection}/auth/azureadoauth2/callback`;

      passport.use('azure', new AzureStrategy({
        clientID: AZURE_CLIENT_ID,
        clientSecret: AZURE_CLIENT_SECRET,
        callbackURL: azureCallbackURL,
        tenant: AZURE_TENANT_ID,
        resource: 'https://graph.windows.net/'
      },
      (accessToken, refreshToken, params, profile, done) => {
        profile.accessToken = accessToken;

        const decrypted = jwt.decode(profile.accessToken);

        const profileData = {
          name: {
            givenName: decrypted.given_name,
            familyName: decrypted.family_name
          },
          fullName: decrypted.name,
          email: decrypted.upn
        };
        getProfilePhotoFromAD(params.access_token, (error, data) => {
          if (!error) {
            profileData.picture = data;
          } else {
            console.log(error);
          }
          profile._json = profileData; // eslint-disable-line no-underscore-dangle
          process.nextTick(() => done(null, profile));
        });
      }));
    }
  }

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });

  return passport;
};
