var config = {
    allScriptsTimeout: 99999,
    capabilities: {
        'browserName': 'chrome'
    },
    baseUrl: 'http://localhost:3006/',
    framework: 'jasmine',
    specs: ['**/*.spec.js'],
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000,
        isVerbose : true,
        includeStackTrace : true
    }
};

if (process.env.TRAVIS_BUILD_NUMBER) {
	config.sauceUser = process.env.SAUCE_USERNAME;
	config.sauceKey = process.env.SAUCE_ACCESS_KEY;
    config.capabilities = {
        'username': process.env.SAUCE_USERNAME,
        'accessKey': process.env.SAUCE_ACCESS_KEY,
        'browserName': 'chrome',
        'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
        'build': process.env.TRAVIS_BUILD_NUMBER,
        'name': 'Hobknob Tests'
    };
}

exports.config = config;