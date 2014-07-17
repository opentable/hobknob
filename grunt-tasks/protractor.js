var task = {
    options: {
      configFile: "client/tests/e2e/protractor.conf.js", // Default config file
      keepAlive: true, // If false, the grunt process stops when the test fails.
      noColor: false, // If true, protractor will not use colors in its output.
      args: {
        seleniumServerJar: 'node_modules/protractor/selenium/selenium-server-standalone-2.42.2.jar',
        chromeDriver: 'node_modules/protractor/selenium/chromedriver'
      }
    },
    run: {

    }
};

module.exports = task;