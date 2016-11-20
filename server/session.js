'use strict';

var session = require('express-session');

module.exports.init = function (config, express) {
  var sessionMiddleware;
  var useConnectEtcdSession;
  var useConnectRedisSession;

  try {
    useConnectEtcdSession = require.resolve('connect-etcd');
  } catch (e) {
    console.log(e);
  }

  try {
    useConnectRedisSession = require.resolve('connect-redis');
  } catch (e) {
    console.log(e);
  }

  if (useConnectEtcdSession) {
    var EtcdStore = require('connect-etcd')(session);

    sessionMiddleware = session({
      store: new EtcdStore({ url: config.etcdHost, port: config.etcdPort }),
      secret: 'hobknob'
    });
  } else if (useConnectRedisSession) {
    var RedisStore = require('connect-redis')(session);

    sessionMiddleware = session({
      store: new RedisStore({ host: config.redisHost, port: config.redisPort }),
      secret: 'hobknob'
    });
  } else {
    sessionMiddleware = express.session();
  }

  return function (req, res, next) {
    if (req.path === '/service-status' || req.path === '/_lbstatus') {
      return next();
    }

    return sessionMiddleware(req, res, next);
  };
};
