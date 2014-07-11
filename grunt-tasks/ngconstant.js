var task = {
    options: {
      name: 'config',
      dest: 'client/configuration/config.js',
      space: '  ',
      wrap: '"use strict";\n\n {%= __ngModule %}'
    },
    development: {
      constants: {
        ENV: {
          name: 'development',
          etcdUri: 'http://127.0.0.1:4001',
          etcdVersion: 'v1'
        }
      }
    },
    production: {
      constants: {
        ENV: {
          name: 'production',
          etcdUri: 'http://127.0.0.1:4001',
          etcdVersion: 'v1'
        }
      }
    }
};

module.exports = task;