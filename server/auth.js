var passport = require("passport"),
    googleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports.init = function(config){
  if (config.RequiresAuth) {
    if (config.AuthProviders.GoogleAuth) {
      var GOOGLE_CLIENT_ID = config.AuthProviders.GoogleAuth.GoogleClientId;
      var GOOGLE_CLIENT_SECRET = config.AuthProviders.GoogleAuth.GoogleClientSecret;
      var googleCallbackURL = (config.hobknobPort) ? "http://" + config.hobknobHost + ":" + config.hobknobPort + "/auth/google/callback" : "http://" + config.hobknobHost + "/auth/google/callback";

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
}
