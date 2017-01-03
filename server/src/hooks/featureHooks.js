const path = require('path');
const async = require('async');
const config = require('../../../config/config.json');

const TIMEOUT = 5 * 1000;

const builtInHooks = [
  './server/src/hooks/audit.js',
];
const customHooks = config.hooks || [];

const hooks = builtInHooks.concat(customHooks).map((hook) => {
  const hookpath = path.resolve(hook);
  try {
    return require(hookpath); // eslint-disable-line import/no-dynamic-require
  } catch (error) {
    console.log(`Error loading hook: ${hookpath}`);
  }

  return null;
});

module.exports.run = (ev) => {
  async.each(hooks, (hook, done) => {
    if (hook[ev.fn]) {
      const fn = async.timeout(hook[ev.fn], TIMEOUT);
      return fn(ev, done);
    }
    return done();
  }, (err) => {
    if (err) {
      console.log(err);
    }
  });
};
