const session = require('express-session');

module.exports.init = (config, express) => {
  let sessionMiddleware;
  let useConnectEtcdSession;
  let useConnectRedisSession;

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
    const EtcdStore = require('connect-etcd')(session);

    sessionMiddleware = session({
      store: new EtcdStore({ url: config.etcdHost, port: config.etcdPort }),
      secret: 'hobknob',
    });
  } else if (useConnectRedisSession) {
    const RedisStore = require('connect-redis')(session);

    sessionMiddleware = session({
      store: new RedisStore({ host: config.redisHost, port: config.redisPort }),
      secret: 'hobknob',
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
