var passport = require("passport"),
    googleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports.init = function(config){
  if (config.RequiresAuth) {
    if (config.AuthProviders.GoogleAuth) {
      var GOOGLE_CLIENT_ID = config.AuthProviders.GoogleAuth.GoogleClientId;
      var GOOGLE_CLIENT_SECRET = config.AuthProviders.GoogleAuth.GoogleClientSecret;
      var protocolSection = (config.hobknobProtocol) ? config.hobknobProtocol : "http";
      var portSection = (config.hobknobPort) ? ":" + config.hobknobPort : '';
      var googleCallbackURL = protocolSection + "://" + config.hobknobHost + portSection + "/auth/google/callback";

      passport.use(new googleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: googleCallbackURL
      },
      function(accessToken, refreshToken, profile, done){
        profile.accessToken = accessToken;
        process.nextTick(function(){
          return done(null, profile);
        });
      }));
    }
  }

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  return passport;
};
