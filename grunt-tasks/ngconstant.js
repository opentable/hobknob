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
          etcdVersion: 'v1',
          etcdCoreVersion: 'v2',
          etcdHost: "127.0.0.1",
          etcdPort: "4001"
        }
      }
    },
    production: {
      constants: {
        ENV: {
          name: 'production',
          etcdUri: 'http://127.0.0.1:4001',
          etcdVersion: 'v1',
          etcdCoreVersion: 'v2',
          etcdHost: "127.0.0.1",
          etcdPort: "4001"
        }
      }
    }
};

module.exports = task;