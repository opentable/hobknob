var task = {
    options: {
      name: 'config',
      dest: 'client/configuration/config.js',
      space: '  ',
      wrap: '"use strict";\n\n {%= __ngModule %}'
    },
    development: {
      constants: {
        ENV: require("../config/default.json")
      }
    },
    production: {
      constants: {
        ENV: require("../config/default.json")
      }
    }
};

module.exports = task;