module.exports.init = function(config){
  var session = require('express-session');

  var sessionMiddleware, useConnectEtcdSession, useConnectRedisSession;
  try {
      useConnectEtcdSession = require.resolve("connect-etcd");
  } catch(e) {
  }

  try {
      useConnectRedisSession = require.resolve("connect-redis");
  } catch(e) {
  }

  if (useConnectEtcdSession) {
    var EtcdStore = require('connect-etcd')(session);

    sessionMiddleware = session({
        store: new EtcdStore({url: config.etcdHost, port: config.etcdPort}),
        secret: 'hobknob'
    });
  }
  else if (useConnectRedisSession) {
    var RedisStore = require('connect-redis')(session);

    sessionMiddleware = session({
        store: new RedisStore({host: config.redisHost, port: config.redisPort}),
        secret: 'hobknob'
    });
  }
  else {
    sessionMiddleware = express.session();
  }

  return function(req, res, next){
    if(req.path === '/service-status' || req.path === '/_lbstatus'){
      return next();
    }

    return sessionMiddleware(req, res, next);
  } ;
}
